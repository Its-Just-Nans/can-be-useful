#![allow(dead_code, unreachable_patterns, non_camel_case_types)]

use std::io::Read;

mod rrc {
    include!("../code.rs");
}

fn main() {
    use asn1_codecs::{uper::UperCodec, PerCodecData};
    let _ = env_logger::init();

    // LTE SIB1 value
    let raw_sib1 =
        hex::decode("68CC42821989C402240F3F6BC2D03EA18C80840C22611D0E098FD080814B62E0").unwrap();
    let mut sib1_codec_data = PerCodecData::from_slice_uper(&raw_sib1);
    let sib1 = rrc::BCCH_DL_SCH_Message::uper_decode(&mut sib1_codec_data);

    eprintln!("sib1: {:#?}", sib1.unwrap());

    let filename = "test_files/sample-BCCH-BCH-Message-1.per";
    let mut buffer_file = std::io::BufReader::new(std::fs::File::open(filename).unwrap());
    // convert buffer to vec[u8]
    let mut buffer = Vec::new();
    buffer_file.read_to_end(&mut buffer).unwrap();
    let mut sib1_codec_data = PerCodecData::from_slice_uper(&buffer);
    let toto = rrc::BCCH_BCH_Message::uper_decode(&mut sib1_codec_data);

    eprintln!("sib1: {:#?}", toto.unwrap());

    let filename = "test_files/message.per";
    let mut buffer_file = std::io::BufReader::new(std::fs::File::open(filename).unwrap());
    // convert buffer to vec[u8]
    let mut buffer = Vec::new();
    buffer_file.read_to_end(&mut buffer).unwrap();
    let mut sib1_codec_data = PerCodecData::from_slice_uper(&buffer);
    let toto = rrc::BCCH_BCH_Message::uper_decode(&mut sib1_codec_data);

    eprintln!("message: {:#?}", toto.unwrap());
}
