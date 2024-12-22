const url = "https://tp.telecom-paris.fr/ajax.php";

const job = async () => {
    const rep = await fetch(url);
    const { data } = await rep.json();
    const final = data.filter(([name, usable]) => usable).map(([name]) => name);
    const randomInt = Math.floor(Math.random() * final.length);
    const choosed = final[randomInt];
    process.stdout.write(choosed);
};

job();
