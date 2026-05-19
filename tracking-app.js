new Vue({
  el: '#app',
  data: {
    pengirimanList: [
      { kode: "JNE Regular", nama: "JNE Regular (3-5 hari)" },
      { kode: "JNE Express", nama: "JNE Express (1-2 hari)" }
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
    ],
    // Dummy awal yang disalin terstruktur dari template berkas soal
    trackingData: {
      "DO2026-001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE Regular",
        tanggalKirim: "2026-05-15",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
          { waktu: "2026-05-15 10:12:20", keterangan: "Penerimaan di Loket UPBJJ" },
          { waktu: "2026-05-16 14:07:56", keterangan: "Tiba di Hub Sortir Logistik" }
        ]
      }
    },
    selectedPaketKode: '',
    detailPaketPilihan: null,
    formDO: {
      nim: '',
      nama: '',
      ekspedisi: '',
      paket: '',
      tanggalKirim: new Date().toISOString().split('T')[0], // Set local time hari ini otomatis
      total: 0
    }
  },

  // Watcher Tambahan (Kriteria 1.5)
  watch: {
    // Watcher 3: Memantau perubahan input pilihan kode paket
    selectedPaketKode: function(newKode) {
      if(!newKode) {
        this.detailPaketPilihan = null;
        this.formDO.total = 0;
      }
    }
  },

  computed: {
    // Menghitung Otomatis ID Sequence DO berdasarkan data yang ada saat ini (Kriteria 1.4 & Soal No 2)
    generateNextDONumber() {
      const currentYear = new Date().getFullYear(); // Ambil Tahun berjalan dinamis (e.g., 2026)
      const keys = Object.keys(this.trackingData);
      let nextSeq = 1;

      if (keys.length > 0) {
        // Ekstrak angka urutan terakhir
        const lastKey = keys[keys.length - 1];
        const parts = lastKey.split('-');
        if (parts.length === 2) {
          nextSeq = parseInt(parts[1]) + 1;
        }
      }
      
      // Formatting padding string angka 3 digit (e.g., 001, 002)
      const padSeq = String(nextSeq).padStart(3, '0');
      return `DO${currentYear}-${padSeq}`;
    }
  },

  methods: {
    // Interaksi ketika user memilih opsi paket bahan ajar
    updateDetailPaket() {
      const pencarian = this.paket.find(p => p.kode === this.selectedPaketKode);
      if (pencarian) {
        this.detailPaketPilihan = pencarian;
        this.formDO.paket = pencarian.kode;
        this.formDO.total = pencarian.harga; // Sinkronisasi otomatis total harga paket
      }
    },
    // Simpan Transaksi Tracking Baru
    simpanDO() {
      const generatedID = this.generateNextDONumber;
      const tglJamSekarang = new Date().toLocaleString('id-ID');

      // Menggunakan Vue.set untuk memasukkan data reactive ke Object literal
      Vue.set(this.trackingData, generatedID, {
        nim: this.formDO.nim,
        nama: this.formDO.nama,
        status: "Manifest Baru (Persiapan Gudang)",
        ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: this.formDO.tanggalKirim,
        paket: this.formDO.paket,
        total: this.formDO.total,
        perjalanan: [
          { waktu: tglJamSekarang, keterangan: "Dokumen DO berhasil dibuat oleh sistem." }
        ]
      });

      // Reset Form Input agar kosong kembali
      this.formDO.nim = '';
      this.formDO.nama = '';
      this.formDO.ekspedisi = '';
      this.selectedPaketKode = '';
      this.formDO.total = 0;
    }
  }
});