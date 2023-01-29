use std::io::prelude::Read;
use std::io::Cursor;

use criterion::{criterion_group, criterion_main, Criterion};

fn to_jpg_dxt1(b: &mut Criterion) {
    b.bench_function("to_png_dxt1", |b| {
        let mut v = Vec::new();
        let mut file = std::fs::File::open("tests/dxt1.paa").unwrap();
        file.read_to_end(&mut v).unwrap();
        b.iter(|| {
            let paa = paa::Paa::read(Cursor::new(v.clone())).unwrap();
            paa.maps[0].get_image();
        });
    });
}

fn to_jpg_dxt5(b: &mut Criterion) {
    b.bench_function("to_png_dxt5", |b| {
        let mut v = Vec::new();
        let mut file = std::fs::File::open("tests/dxt5.paa").unwrap();
        file.read_to_end(&mut v).unwrap();
        b.iter(|| {
            let paa = paa::Paa::read(Cursor::new(v.clone())).unwrap();
            paa.maps[0].get_image();
        });
    });
}

criterion_group!(benches, to_jpg_dxt1, to_jpg_dxt5);
criterion_main!(benches);
