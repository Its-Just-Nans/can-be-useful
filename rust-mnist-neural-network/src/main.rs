//! rust-mnist-neural-network
//! Simple MNIST NN from scratch in rust inspired by https://www.youtube.com/watch?v=w8yWXqWQYmU
//! repo at https://github.com/Its-Just-Nans/rust-mnist-neural-network
//! Download the MNIST dataset as `train.csv` (the default name) from
//! [kaggle](https://www.kaggle.com/competitions/digit-recognizer/data?select=train.csv) (for example).

use ndarray::prelude::{s, Array1, Array2, Axis};
use rand::seq::SliceRandom;
use std::fs::File;
use std::io::{BufRead, BufReader};

fn load_data(
    filename: &str,
    test_size: usize,
) -> (Array2<f64>, Array1<u64>, Array2<f64>, Array1<u64>) {
    // Load and preprocess the dataset
    let csv_file = File::open(filename).expect("Failed to open file");
    let reader = BufReader::new(csv_file);

    let data: Vec<Vec<u64>> = reader
        .lines()
        .skip(1)
        .map(|l| {
            l.expect("Failed to parse line")
                .split(',')
                .map(|x| x.parse::<u64>().expect("Invalid number"))
                .collect()
        })
        .collect();

    println!("Data loaded: {} rows", data.len());
    let data_array = Array2::from_shape_vec(
        (data.len(), data[0].len()),
        data.into_iter().flatten().collect(),
    )
    .expect("Failed to create ndarray");

    let mut rng = rand::thread_rng();
    let mut indices: Vec<usize> = (0..data_array.nrows()).collect();
    indices.shuffle(&mut rng);

    let shuffled_data: Array2<u64> = data_array.select(Axis(0), &indices);

    // Split into training and development sets
    let (test_data_split, train_data_split) = shuffled_data.view().split_at(Axis(0), test_size);

    // Separate labels and features, normalize features
    let label_test = test_data_split.column(0).to_owned();
    let data_test = test_data_split
        .slice(s![.., 1..])
        .mapv(|x| (x as f64) / 255.0);

    let label_train = train_data_split.column(0).to_owned();
    let data_train = train_data_split
        .slice(s![.., 1..])
        .mapv(|x| (x as f64) / 255.0);

    (data_train, label_train, data_test, label_test)
}

// ReLU activation function
fn relu(x: &Array2<f64>) -> Array2<f64> {
    x.mapv(|v| v.max(0.0))
}

// ReLU derivative
fn relu_derivative(x: &Array2<f64>) -> Array2<f64> {
    x.mapv(|v| if v > 0.0 { 1.0 } else { 0.0 })
}

// Softmax activation function
fn softmax(x: &Array2<f64>) -> Array2<f64> {
    let exp_x = x.mapv(f64::exp);
    let sum_exp = exp_x.sum_axis(Axis(0));
    exp_x / &sum_exp
}

// Forward propagation
fn forward_propagation(
    x: &Array2<f64>,
    w1: &Array2<f64>,
    b1: &Array2<f64>,
    w2: &Array2<f64>,
    b2: &Array2<f64>,
) -> (Array2<f64>, Array2<f64>, Array2<f64>, Array2<f64>) {
    let z1 = w1.dot(&x.t()) + b1;
    let a1 = relu(&z1);
    let z2 = w2.dot(&a1) + b2;
    let a2 = softmax(&z2);
    (z1, a1, z2, a2)
}

fn one_hot(y: &Array1<u64>) -> Array2<f64> {
    let mut y_one_hot = Array2::<f64>::zeros((10, y.len()));
    for (i, &label) in y.iter().enumerate() {
        y_one_hot[[label as usize, i]] = 1.0;
    }
    y_one_hot
}

// Backward propagation
fn backward_propagation(
    data: &Array2<f64>,
    labels: &Array1<u64>,
    z1: &Array2<f64>,
    a1: &Array2<f64>,
    a2: &Array2<f64>,
    w2: &Array2<f64>,
) -> (Array2<f64>, Array1<f64>, Array2<f64>, Array1<f64>) {
    let m = data.ncols() as f64;

    let one_hot = one_hot(&labels);
    let dz2 = a2 - &one_hot;

    // Layer 2 gradients
    let dw2 = dz2.dot(&a1.t()) / m;
    let db2 = dz2.sum_axis(Axis(1)) / m;

    // Layer 1 gradients
    let dz1 = w2.t().dot(&dz2) * relu_derivative(z1);
    let dw1 = dz1.dot(data) / m;
    let db1 = dz1.sum_axis(Axis(1)) / m;

    (dw1, db1, dw2, db2)
}

fn get_predictions(a2: &Array2<f64>) -> Array1<u64> {
    a2.map_axis(Axis(0), |row| {
        row.iter()
            .enumerate()
            .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap())
            .unwrap()
            .0 as u64
    })
}

fn get_correct_predictions(predictions: &Array1<u64>, labels: &Array1<u64>) -> (usize, f64) {
    let correct_predictions = predictions
        .iter()
        .zip(labels.iter())
        .filter(|(pred, actual)| **pred == **actual)
        .count();
    let accuracy = (correct_predictions as f64) / labels.len() as f64;
    (correct_predictions, accuracy)
}

fn gradient_descent(
    x_train: &Array2<f64>,
    label_train: &Array1<u64>,
    learning_rate: f64,
    epochs: usize,
) -> (Array2<f64>, Array2<f64>, Array2<f64>, Array2<f64>) {
    let img_size = x_train.ncols();
    let hidden_layer_size = 10;
    let mut w1 = Array2::<f64>::from_shape_fn((hidden_layer_size, img_size), |_| {
        rand::random::<f64>() - 0.5
    });
    let mut b1 = Array2::<f64>::from_shape_fn((10, 1), |_| rand::random::<f64>() - 0.5);
    let mut w2 = Array2::<f64>::from_shape_fn((10, 10), |_| rand::random::<f64>() - 0.5);
    let mut b2 = Array2::<f64>::from_shape_fn((10, 1), |_| rand::random::<f64>() - 0.5);

    for epoch in 0..epochs {
        // Forward propagation
        let (z1, a1, _, a2) = forward_propagation(x_train, &w1, &b1, &w2, &b2);

        // Backward propagation
        let (dw1, db1, dw2, db2) = backward_propagation(x_train, &label_train, &z1, &a1, &a2, &w2);

        // Parameter updates
        w1 -= &(learning_rate * &dw1);
        b1 -= &(learning_rate * &db1.insert_axis(Axis(1)));
        w2 -= &(learning_rate * &dw2);
        b2 -= &(learning_rate * &db2.insert_axis(Axis(1)));

        if epoch % 10 == 0 {
            let predictions = get_predictions(&a2);
            let (_, accuracy) = get_correct_predictions(&predictions, &label_train);
            println!("Epoch {:#03}: accuracy = {:.2}%", epoch, accuracy * 100.0);
        }
    }

    (w1, b1, w2, b2)
}

fn display_image(x: &Array1<f64>, text: &str) {
    let size = (x.len() as f64).sqrt() as usize; // image size is a square
    for y_idx in 0..size {
        for x_idx in 0..size {
            let pixel = x[y_idx * size + x_idx];
            let symbol = if pixel > 0.5 { "⬜" } else { "⬛" };
            print!("{}", symbol);
        }
        if y_idx == size / 2 {
            print!("    {}", text);
        }
        println!();
    }
}

fn main() {
    let mut filename = "train.csv".to_string();
    if let Some(arg1) = std::env::args().nth(1) {
        filename = arg1.to_string();
    }
    println!("🟠Loading data from '{}'...", &filename);
    let test_size = 1000;
    let (data_train, label_train, data_test, label_test) = load_data(&filename, test_size);
    display_image(
        &data_train.row(0).to_owned(),
        &format!("Label: {}", label_train[0]),
    );
    println!("🟢Loading complete (test size = {})", test_size);

    // Train the model
    let learning_rate = 0.01;
    let epochs = 200;
    println!(
        "🟠Training model with {} epochs and a {} learning rate on {} data...",
        epochs,
        learning_rate,
        data_train.nrows()
    );
    let (w1, b1, w2, b2) = gradient_descent(&data_train, &label_train, learning_rate, epochs);
    println!("🟢Training complete!");

    // Test the model
    println!("🟠Testing on test set...");
    let (_, _, _, a2) = forward_propagation(&data_test, &w1, &b1, &w2, &b2);
    let predictions = get_predictions(&a2);
    let (_, accuracy) = get_correct_predictions(&predictions, &label_test);
    println!("🟢Accuracy on test set: {:.2}%", accuracy * 100.0);

    // Show some predictions
    println!("🟠Showing some predictions (on test set)...");
    for idx_test in 0..3 {
        let x_actual = data_test.row(idx_test).to_owned();
        let label_actual = label_test[idx_test];
        let x_single = x_actual.clone().insert_axis(Axis(0)); // Reshape to a 2D array
        let (_, _, _, a2) = forward_propagation(&x_single, &w1, &b1, &w2, &b2);
        let y_pred = get_predictions(&a2)[0];
        let text = format!("Label: {}, Predicted = {}", label_actual, y_pred);
        display_image(&x_actual, &text);
    }
    println!("🟢Finished");
}
