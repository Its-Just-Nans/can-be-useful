#[derive(Debug, Clone, Copy)]
pub enum TT {
    Unloaded([u8; 2]),
    Loaded((u8, u8)),
}

#[derive(Debug)]
pub struct A(std::cell::Cell<TT>);

impl A {
    pub fn new(ar: &[u8]) -> Self {
        Self(std::cell::Cell::new(TT::Unloaded([ar[0], ar[1]])))
    }

    fn get_value(&self) -> (u8, u8) {
        match self.0.get() {
            TT::Unloaded(v) => {
                let a = (v[0], v[1]);
                self.0.set(TT::Loaded(a));
                a
            }
            TT::Loaded(a) => a,
        }
    }

    pub fn get_one(&self) -> u8 {
        self.get_value().0
    }
}

fn main() {
    let a = A::new(&[1, 2, 3]);
    println!("{a:?}");
    println!("Hello, world! {}", a.get_one());
    println!("{a:?}");
}
