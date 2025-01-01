# test-3gpp-hampi

- <https://github.com/ystero-dev/hampi>

## 1.Install tools

```sh
cargo install asn1-compiler
# download the docx
```

## 2.Extract asn1

```sh
# https://github.com/Its-Just-Nans/docx-asn1
python -m pip install docx-asn1
python -m docx_asn1 file.docx > output.asn1
```

## 3.Generate rust types from asn1

```sh
hampi-rs-asn1c  --codec  uper --module code.rs -- output.asn1

# with derive
hampi-rs-asn1c  --codec  uper --derive serialize --derive deserialize --module code.rs -- output.asn1
```

## 4. Test to load

The rust file uses the types in code.rs

```sh
cargo run
```

Made from 2024-02-14 to 2024-04-19
