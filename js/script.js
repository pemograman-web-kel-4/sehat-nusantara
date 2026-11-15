/* ============================================================
   script.js - dipakai bersama oleh semua halaman.
   Setiap blok dicek dengan if (elemen) agar tidak error di halaman lain.
   Seluruh data bersifat SIMULASI dan tidak disimpan permanen.
   ============================================================ */

// ---------- Pertemuan 3: data (array of objects) ----------
const daftarPoli = [
  { kode: "UMUM", nama: "Poliklinik Umum" },
  { kode: "GIGI", nama: "Poliklinik Gigi" },
  { kode: "KIA", nama: "Poliklinik KIA" },
  { kode: "GIZI", nama: "Poliklinik Gizi" }
];

const daftarDokter = [
  { id: 1, nama: "dr. Andi Prasetyo", poli: "UMUM", spesialisasi: "Dokter Umum", hari: ["Senin", "Rabu", "Jumat"], jam: "08.00 - 12.00", maxQuota: 10, currentPatients: 0 },
  { id: 2, nama: "dr. Siti Rahmawati", poli: "UMUM", spesialisasi: "Dokter Umum", hari: ["Selasa", "Kamis", "Sabtu"], jam: "13.00 - 17.00", maxQuota: 10, currentPatients: 0 },
  { id: 3, nama: "drg. Budi Santoso", poli: "GIGI", spesialisasi: "Dokter Gigi Umum", hari: ["Senin", "Kamis"], jam: "09.00 - 13.00", maxQuota: 10, currentPatients: 0 },
  { id: 4, nama: "drg. Maya Anggraini", poli: "GIGI", spesialisasi: "Perawatan Gigi Anak", hari: ["Selasa", "Jumat"], jam: "14.00 - 18.00", maxQuota: 10, currentPatients: 0 },
  { id: 5, nama: "dr. Rina Wulandari", poli: "KIA", spesialisasi: "Kesehatan Ibu dan Kehamilan", hari: ["Senin", "Rabu", "Jumat"], jam: "08.00 - 11.00", maxQuota: 10, currentPatients: 0 },
  { id: 6, nama: "dr. Hendra Kusuma", poli: "KIA", spesialisasi: "Kesehatan Anak dan Imunisasi", hari: ["Selasa", "Kamis"], jam: "10.00 - 14.00", maxQuota: 10, currentPatients: 0 },
  { id: 7, nama: "Dewi Lestari, S.Gz", poli: "GIZI", spesialisasi: "Konsultasi Gizi Klinik", hari: ["Senin", "Selasa", "Kamis"], jam: "09.00 - 12.00", maxQuota: 10, currentPatients: 0 },
  { id: 8, nama: "Fajar Nugroho, S.Gz", poli: "GIZI", spesialisasi: "Gizi Anak dan Olahraga", hari: ["Rabu", "Sabtu"], jam: "09.00 - 13.00", maxQuota: 10, currentPatients: 0 }
];

const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
// Penghitung nomor antrean simulasi per poliklinik (dimulai dari 6 agar nomor pertama 007)
const penghitungAntrean = { UMUM: 6, GIGI: 6, KIA: 6, GIZI: 6 };

// ---------- Pertemuan 3: fungsi-fungsi dasar ----------
function ambilNamaPoli(kode) {
  for (const poli of daftarPoli) {
    if (poli.kode === kode) return poli.nama;
  }
  return "";
}

// Fungsi sapaan sesuai waktu
function buatSapaan(jam) {
  if (jam < 11) return "Selamat pagi";
  else if (jam < 15) return "Selamat siang";
  else if (jam < 18) return "Selamat sore";
  return "Selamat malam";
}

// Fungsi menghitung usia dari tanggal lahir (memakai tanggal lokal)
function hitungUsia(tanggalLahir, hariIni) {
  let usia = hariIni.getFullYear() - tanggalLahir.getFullYear();
  const selisihBulan = hariIni.getMonth() - tanggalLahir.getMonth();
  if (selisihBulan < 0 || (selisihBulan === 0 && hariIni.getDate() < tanggalLahir.getDate())) {
    usia--; // belum ulang tahun tahun ini
  }
  return usia;
}

// Fungsi membuat nomor antrean simulasi, contoh: UMUM-007
function buatNomorAntrean(kodePoli) {
  penghitungAntrean[kodePoli]++;
  return kodePoli + "-" + String(penghitungAntrean[kodePoli]).padStart(3, "0");
}

// Mengubah objek Date menjadi teks "YYYY-MM-DD" (waktu lokal) untuk atribut min/max input date
function formatTanggalInput(tgl) {
  return tgl.getFullYear() + "-" + String(tgl.getMonth() + 1).padStart(2, "0") + "-" + String(tgl.getDate()).padStart(2, "0");
}

// Mengubah teks "YYYY-MM-DD" menjadi Date lokal (jam 00:00)
function bacaTanggal(teks) {
  const bagian = teks.split("-");
  return new Date(Number(bagian[0]), Number(bagian[1]) - 1, Number(bagian[2]));
}

function formatTanggalIndonesia(tgl) {
  return tgl.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function amankanTeks(teks) {
  return teks.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------- Pertemuan 4: render data dokter ke DOM ----------
function buatKartuDokter(d) {
  let barisJadwal = "";
  for (let i = 0; i < d.hari.length; i++) {
    barisJadwal += `<tr><td>${d.hari[i]}</td><td>${d.jam} WIB</td></tr>`;
  }
  return `<div class="col-md-6 col-lg-4">
    <article class="card">
      <div class="card-body">
        <div class="d-flex align-items-center gap-3">
          <i class="bi bi-person-circle avatar" aria-hidden="true"></i>
          <div><h3 class="card-title h5 mb-1">${d.nama}</h3><span class="badge badge-poli">${ambilNamaPoli(d.poli)}</span></div>
        </div>
        <p class="card-text bidang-dokter mb-2 mt-2"><strong>Bidang:</strong> ${d.spesialisasi}</p>
        <button type="button" class="btn btn-garis btn-sm w-100" data-jadwal="${d.id}">Lihat jadwal</button>
        <div class="jadwal d-none" id="jadwal-${d.id}">
          <table class="table table-sm tabel-jadwal mb-0">
            <thead><tr><th scope="col">Hari praktik</th><th scope="col">Jam praktik</th></tr></thead>
            <tbody>${barisJadwal}</tbody>
          </table>
        </div>
      </div>
    </article>
  </div>`;
}

function tampilkanDokter(data) {
  const wadah = document.getElementById("daftarDokter");
  let html = "";
  for (let i = 0; i < data.length; i++) {
    html += buatKartuDokter(data[i]);
  }
  wadah.innerHTML = html || '<p class="text-center">Belum ada dokter pada poliklinik ini.</p>';
}

function filterDokter(kodePoli) {
  if (kodePoli === "SEMUA") return daftarDokter;
  const hasil = [];
  for (const d of daftarDokter) {
    if (d.poli === kodePoli) hasil.push(d);
  }
  return hasil;
}

// Sisa kuota dokter (maxQuota - currentPatients)
function sisaKuota(d) {
  return d.maxQuota - d.currentPatients;
}

// Dropdown dokter pada formulir mengikuti poliklinik (data diambil dari array yang sama)
function isiPilihanDokter(kodePoli) {
  const pilihan = document.getElementById("dokter");
  if (kodePoli === "") {
    pilihan.innerHTML = '<option value="">Pilih poliklinik terlebih dahulu</option>';
    return;
  }
  let html = '<option value="">-- Pilih dokter --</option>';
  for (const d of filterDokter(kodePoli)) {
    const sisa = sisaKuota(d);
    const infoKuota = sisa > 0 ? "sisa kuota " + sisa + "/" + d.maxQuota : "KUOTA PENUH";
    html += `<option value="${d.id}">${d.nama} (${d.hari.join(", ")}, ${d.jam}) - ${infoKuota}</option>`;
  }
  pilihan.innerHTML = html;
}

function isiPilihanPoli(idElemen, denganSemua) {
  let html = denganSemua ? '<option value="SEMUA">Semua poliklinik</option>' : '<option value="">-- Pilih poliklinik --</option>';
  for (const p of daftarPoli) {
    html += `<option value="${p.kode}">${p.nama}</option>`;
  }
  document.getElementById(idElemen).innerHTML = html;
}

// ---------- Bonus: mode gelap ----------
// Tema awal sudah dipasang oleh skrip kecil di <head>; bagian ini menyinkronkan tombol dan menangani klik.
const tombolTema = document.getElementById("tombolTema");
if (tombolTema) {
  const akar = document.documentElement;

  function terapkanTema(tema) {
    const gelap = tema === "dark";
    akar.setAttribute("data-bs-theme", tema);
    tombolTema.setAttribute("aria-pressed", String(gelap));
    tombolTema.querySelector("i").className = gelap ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  }

  terapkanTema(akar.getAttribute("data-bs-theme") === "dark" ? "dark" : "light");

  // Event click: pilihan tema disimpan agar tetap sama di halaman lain
  tombolTema.addEventListener("click", function () {
    const temaBaru = akar.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    terapkanTema(temaBaru);
    try { localStorage.setItem("tema", temaBaru); } catch (e) { /* penyimpanan diblokir: tema berlaku sementara */ }
  });
}

// ---------- Beranda ----------
const elemenSapaan = document.getElementById("sapaan");
if (elemenSapaan) {
  elemenSapaan.textContent = buatSapaan(new Date().getHours()) + "! Selamat datang di Klinik Sehat Nusantara.";
}

const elemenHariIni = document.getElementById("dokterHariIni");
if (elemenHariIni) {
  const hariIni = namaHari[new Date().getDay()];
  let html = "";
  for (const d of daftarDokter) {
    if (d.hari.includes(hariIni)) {
      html += `<li class="list-group-item d-flex justify-content-between flex-wrap"><span><strong>${d.nama}</strong> - ${ambilNamaPoli(d.poli)}</span><span>${d.jam} WIB</span></li>`;
    }
  }
  document.getElementById("labelHari").textContent = hariIni;
  elemenHariIni.innerHTML = html || '<li class="list-group-item">Tidak ada jadwal praktik hari ini.</li>';
}

// ---------- Halaman Dokter ----------
if (document.getElementById("daftarDokter")) {
  isiPilihanPoli("filterPoli", true);
  tampilkanDokter(daftarDokter);

  // Event change: filter dokter
  document.getElementById("filterPoli").addEventListener("change", function () {
    tampilkanDokter(filterDokter(this.value));
  });

  // Event click: tampil/sembunyikan jadwal (event delegation pada wadah kartu)
  document.getElementById("daftarDokter").addEventListener("click", function (e) {
    const tombol = e.target.closest("[data-jadwal]");
    if (!tombol) return;
    const kotak = document.getElementById("jadwal-" + tombol.dataset.jadwal);
    kotak.classList.toggle("d-none");
    tombol.textContent = kotak.classList.contains("d-none") ? "Lihat jadwal" : "Sembunyikan jadwal";
  });
}

// ---------- Halaman Pendaftaran (Pertemuan 8: validasi) ----------
const formDaftar = document.getElementById("formPendaftaran");
if (formDaftar) {
  const $ = (id) => document.getElementById(id);
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);
  const batasKunjungan = new Date(hariIni);
  batasKunjungan.setDate(batasKunjungan.getDate() + 14);

  $("tglLahir").max = formatTanggalInput(hariIni);
  const batasLahir = new Date(hariIni);
  batasLahir.setFullYear(batasLahir.getFullYear() - 120);   // paling lama 120 tahun yang lalu
  $("tglLahir").min = formatTanggalInput(batasLahir);
  $("tglKunjungan").min = formatTanggalInput(hariIni);
  $("tglKunjungan").max = formatTanggalInput(batasKunjungan);
  isiPilihanPoli("poli", false);
  isiPilihanDokter("");

  // Pilih poli otomatis jika datang dari tombol "Daftar" (pendaftaran.html?poli=GIGI)
  const poliDariTautan = new URLSearchParams(window.location.search).get("poli");
  if (poliDariTautan && ambilNamaPoli(poliDariTautan) !== "") {
    $("poli").value = poliDariTautan;
    isiPilihanDokter(poliDariTautan);
  }

  // Aturan validasi: tiap fungsi mengembalikan pesan error ("" jika valid)
  function cekNama() {
    const v = $("nama").value.trim();
    if (v === "") return "Nama lengkap wajib diisi.";
    if (!/^[A-Za-z\s]+$/.test(v)) return "Nama hanya boleh berisi huruf dan spasi.";
    if (v.length < 3) return "Nama minimal 3 karakter.";
    return "";
  }
  function cekNik() {
    const v = $("nik").value.trim();
    if (v === "") return "NIK wajib diisi.";
    if (!/^\d+$/.test(v)) return "NIK hanya boleh berisi angka (tanpa huruf, spasi, atau simbol).";
    if (!/^\d{16}$/.test(v)) return "NIK harus 16 digit (saat ini " + v.length + " digit).";
    return "";
  }
  function cekTglLahir() {
    const v = $("tglLahir").value;
    if (v === "") return "Tanggal lahir wajib diisi.";
    if (bacaTanggal(v) > hariIni) return "Tanggal lahir tidak boleh di masa depan.";
    if (bacaTanggal(v) < batasLahir) return "Tanggal lahir tidak valid (maksimal 120 tahun yang lalu).";
    return "";
  }
  function cekJenisKelamin() {
    return document.querySelector('input[name="jk"]:checked') ? "" : "Pilih salah satu jenis kelamin.";
  }
  function cekHp() {
    const v = $("hp").value.trim();
    if (v === "") return "Nomor HP wajib diisi.";
    if (!/^\d+$/.test(v)) return "Nomor HP hanya boleh berisi angka.";
    if (!/^(08|62)/.test(v)) return "Nomor HP harus diawali 08 atau 62.";
    if (v.length < 10 || v.length > 14) return "Nomor HP harus 10-14 digit (saat ini " + v.length + " digit).";
    return "";
  }
  function cekEmail() {
    const v = $("email").value.trim();
    if (v === "") return ""; // opsional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Format email tidak benar, contoh: nama@email.com.";
  }
  function cekPoli() {
    return $("poli").value === "" ? "Pilih poliklinik tujuan." : "";
  }
  function cekDokter() {
    if ($("dokter").value === "") return "Pilih dokter sesuai poliklinik.";
    const d = daftarDokter.find((x) => x.id === Number($("dokter").value));
    if (d && d.currentPatients >= d.maxQuota) return "Kuota " + d.nama + " sudah penuh (" + d.maxQuota + "/" + d.maxQuota + "). Pilih dokter lain.";
    return "";
  }
  function cekTglKunjungan() {
    const v = $("tglKunjungan").value;
    if (v === "") return "Tanggal kunjungan wajib diisi.";
    const tgl = bacaTanggal(v);
    if (tgl < hariIni) return "Tanggal kunjungan tidak boleh sebelum hari ini.";
    if (tgl > batasKunjungan) return "Tanggal kunjungan maksimal 14 hari dari hari ini.";
    // Hari kunjungan harus termasuk hari praktik dokter yang dipilih (jika dokter sudah dipilih)
    const dokterDipilih = daftarDokter.find((x) => x.id === Number($("dokter").value));
    const hariKunjungan = namaHari[tgl.getDay()];
    if (dokterDipilih && !dokterDipilih.hari.includes(hariKunjungan)) {
      return dokterDipilih.nama + " tidak praktik pada hari " + hariKunjungan + ". Hari praktik: " + dokterDipilih.hari.join(", ") + ".";
    }
    return "";
  }
  function cekKeluhan() {
    const panjang = $("keluhan").value.trim().length;
    if (panjang === 0) return "Keluhan wajib diisi.";
    if (panjang < 10) return "Keluhan minimal 10 karakter (saat ini " + panjang + ").";
    if (panjang > 200) return "Keluhan maksimal 200 karakter (saat ini " + panjang + ").";
    return "";
  }
  function cekSetuju() {
    return $("setuju").checked ? "" : "Anda harus menyetujui penggunaan data untuk melanjutkan.";
  }

  const daftarKolom = [
    { id: "nama", cek: cekNama }, { id: "nik", cek: cekNik }, { id: "tglLahir", cek: cekTglLahir },
    { id: "jk", cek: cekJenisKelamin }, { id: "hp", cek: cekHp }, { id: "email", cek: cekEmail },
    { id: "poli", cek: cekPoli }, { id: "dokter", cek: cekDokter }, { id: "tglKunjungan", cek: cekTglKunjungan },
    { id: "keluhan", cek: cekKeluhan }, { id: "setuju", cek: cekSetuju }
  ];

  // Aksesibilitas: hubungkan tiap kolom dengan pesan error-nya agar dibacakan pembaca layar
  for (const kolom of daftarKolom) {
    const input = $(kolom.id);
    if (!input) continue;   // kelompok radio "jk" tidak punya satu elemen ber-id ini
    input.setAttribute("aria-describedby", ((input.getAttribute("aria-describedby") || "") + " err-" + kolom.id).trim());
  }

  // Menampilkan/menghapus pesan error di bawah kolom; mengembalikan true jika valid
  function validasiKolom(kolom) {
    const pesan = kolom.cek();
    $("err-" + kolom.id).textContent = pesan;
    const input = $(kolom.id);
    if (input) {
      input.classList.toggle("is-invalid", pesan !== "");
      input.setAttribute("aria-invalid", String(pesan !== ""));
    }
    return pesan === "";
  }

  // Kuota: nonaktifkan tombol kirim jika dokter terpilih sudah penuh
  function perbaruiTombolKirim() {
    const d = daftarDokter.find((x) => x.id === Number($("dokter").value));
    $("tombolKirim").disabled = d !== undefined && d.currentPatients >= d.maxQuota;
  }

  // Event change: validasi tiap kolom setelah diisi
  for (const kolom of daftarKolom) {
    const target = kolom.id === "jk" ? document.querySelectorAll('input[name="jk"]') : [$(kolom.id)];
    for (const t of target) {
      t.addEventListener("change", function () { validasiKolom(kolom); });

      // TAMBAHAN: cek kolom kosong saat kehilangan fokus (blur)
      if (kolom.id !== "jk" && kolom.id !== "setuju") {
        t.addEventListener("blur", function () { validasiKolom(kolom); });
      }
    }
  }

  // Event input: validasi NIK real-time (hanya angka, maks. 16, warna border)
  $("nik").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 16); // buang non-angka, batasi 16
    const panjang = this.value.length;

    this.classList.remove("is-invalid", "is-valid");
    this.setAttribute("aria-invalid", String(panjang > 0 && panjang < 16));
    if (panjang === 0) {
      $("err-nik").textContent = "";                  // kosong: tampilan normal
    } else if (panjang < 16) {
      this.classList.add("is-invalid");               // merah
      $("err-nik").textContent = "NIK harus 16 digit (saat ini " + panjang + " digit).";
    } else {
      this.classList.add("is-valid");                 // hijau
      $("err-nik").textContent = "";
    }
  });

  // Event change: poliklinik -> dokter berubah otomatis
  $("poli").addEventListener("change", function () {
    isiPilihanDokter(this.value);
    $("err-dokter").textContent = "";                 // TAMBAHAN: hapus pesan kuota lama
    $("dokter").classList.remove("is-invalid");       // TAMBAHAN
    perbaruiTombolKirim();                            // TAMBAHAN: dokter di-reset, tombol aktif lagi
  });

  // TAMBAHAN: pilih dokter -> cek kuota, atur tombol kirim
  $("dokter").addEventListener("change", function () {
    perbaruiTombolKirim();
    // Hari praktik bergantung pada dokter: periksa ulang tanggal kunjungan jika sudah diisi
    if ($("tglKunjungan").value !== "") validasiKolom(daftarKolom.find((k) => k.id === "tglKunjungan"));
  });

  // Event change: usia dihitung otomatis
  $("tglLahir").addEventListener("change", function () {
    if (this.value !== "" && bacaTanggal(this.value) <= hariIni) {
      $("usia").textContent = "Usia: " + hitungUsia(bacaTanggal(this.value), new Date()) + " tahun";
    } else {
      $("usia").textContent = "";
    }
  });

  // Event input: penghitung karakter keluhan secara langsung
  $("keluhan").addEventListener("input", function () {
    const panjang = this.value.length;
    $("hitungKeluhan").textContent = panjang + " / 200 karakter";
    $("hitungKeluhan").classList.toggle("melebihi", panjang > 200);
  });

  // Event submit: validasi seluruh kolom, tampilkan modal jika valid
  formDaftar.addEventListener("submit", function (e) {
    e.preventDefault();
    let semuaValid = true;
    let kolomPertamaSalah = null;
    for (const kolom of daftarKolom) {
      if (!validasiKolom(kolom)) {
        semuaValid = false;
        if (!kolomPertamaSalah) kolomPertamaSalah = kolom.id;
      }
    }
    if (!semuaValid) {
      const fokus = kolomPertamaSalah === "jk" ? document.querySelector('input[name="jk"]') : $(kolomPertamaSalah);
      fokus.focus();
      return;
    }
    tampilkanRingkasan();
  });

  function tampilkanRingkasan() {
    const dokter = daftarDokter.find((d) => d.id === Number($("dokter").value));
    const lahir = bacaTanggal($("tglLahir").value);
    const email = $("email").value.trim();
    const baris = [
      ["Nama pasien", $("nama").value.trim()],
      ["NIK", $("nik").value.trim()],
      ["Tanggal lahir & usia", formatTanggalIndonesia(lahir) + " (" + hitungUsia(lahir, new Date()) + " tahun)"],
      ["Jenis kelamin", document.querySelector('input[name="jk"]:checked').value],
      ["Nomor HP", $("hp").value.trim()],
      ["Poliklinik", ambilNamaPoli($("poli").value)],
      ["Dokter", dokter.nama],
      ["Tanggal kunjungan", formatTanggalIndonesia(bacaTanggal($("tglKunjungan").value))],
      ["Keluhan", $("keluhan").value.trim()]
    ];
    if (email !== "") baris.splice(5, 0, ["Email", email]);

    let html = "";
    for (const [label, nilai] of baris) {
      html += `<tr><th scope="row" class="w-40">${label}</th><td>${amankanTeks(nilai)}</td></tr>`;
    }
    $("isiRingkasan").innerHTML = html;
    const nomor = buatNomorAntrean($("poli").value);
    $("nomorAntrean").textContent = nomor;
    dokter.currentPatients++;   // kuota dokter berkurang 1

    // Bootstrap dimuat dari CDN. Jika gagal dimuat (mis. tanpa internet), ringkasan tetap sampai ke pengguna lewat alert.
    if (typeof bootstrap === "undefined") {
      let teks = "Pendaftaran berhasil.\nNomor antrean: " + nomor + "\n";
      for (const [label, nilai] of baris) {
        teks += "\n" + label + ": " + nilai;
      }
      alert(teks);
      resetFormulir();
      return;
    }
    bootstrap.Modal.getOrCreateInstance($("modalRingkasan")).show();
  }

  // Mengosongkan formulir ke keadaan awal
  function resetFormulir() {
    formDaftar.reset();
    formDaftar.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    isiPilihanDokter("");
    $("usia").textContent = "";
    $("hitungKeluhan").textContent = "0 / 200 karakter";
    $("nik").classList.remove("is-invalid", "is-valid");   // <-- tambahan
    $("err-nik").textContent = "";                         // <-- tambahan
    $("tombolKirim").disabled = false;   // aktifkan lagi setelah form dikosongkan
    $("err-dokter").textContent = "";
  }

  // Event click: cetak ringkasan (aturan @media print di style.css hanya mencetak isi modal)
  $("tombolCetak").addEventListener("click", function () {
    window.print();
  });

  // Setelah modal ditutup, formulir dikosongkan kembali
  $("modalRingkasan").addEventListener("hidden.bs.modal", resetFormulir);
}
