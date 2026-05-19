new Vue({
  el: '#app',
  data: {
    // Diambil langsung dari kerangka dataBahanAjar.js lampiran UT
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    stok: [
      { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
      { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
      { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
      { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" }
    ],
    // State Filter & Fitur Tambahan
    filterUPBJJ: '',
    filterKategori: '',
    filterKritis: false,
    sortBy: 'judul',
    editIndex: null,
    errorForm: '',
    formBaru: { kode: '', judul: '', kategori: '', upbjj: '', qty: 0, safety: 0 }
  },
  
  // Watcher Minimal 2 buah (Kriteria 1.5)
  watch: {
    // Watcher 1: Jika filter UPBJJ berubah/dikosongkan, reset filter kategori turunannya (Dependent)
    filterUPBJJ: function (newVal, oldVal) {
      this.filterKategori = ''; 
      console.log(`UPBJJ berubah dari ${oldVal} ke ${newVal}`);
    },
    // Watcher 2: Memantau jika jumlah data stok bertambah (Alert log console)
    stok: {
      handler: function (after, before) {
        console.log('Terjadi perubahan manipulasi data/stok terupdate.');
      },
      deep: true
    }
  },

  // Computed Properties (Kriteria 1.4 - Menghindari recomputation berlebih)
  computed: {
    filteredAndSortedStok() {
      let result = this.stok;

      // 1. Filter UPBJJ
      if (this.filterUPBJJ) {
        result = result.filter(item => item.upbjj === this.filterUPBJJ);
      }
      // 2. Filter Kategori
      if (this.filterKategori) {
        result = result.filter(item => item.kategori === this.filterKategori);
      }
      // 3. Filter Kritis (qty < safety ATAU qty == 0)
      if (this.filterKritis) {
        result = result.filter(item => item.qty < item.safety || item.qty === 0);
      }

      // 4. Pengurutan / Sort
      return result.sort((a, b) => {
        if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
        if (this.sortBy === 'qty') return a.qty - b.qty;
        if (this.sortBy === 'harga') return a.harga - b.harga;
        return 0;
      });
    }
  },

  // Methods Properties (Kriteria 1.4)
  methods: {
    statusText(qty, safety) {
      if (qty === 0) return 'Kosong';
      if (qty < safety) return 'Menipis';
      return 'Aman';
    },
    statusClass(qty, safety) {
      if (qty === 0) return 'badge bg-danger text-white'; // Merah
      if (qty < safety) return 'badge bg-warning text-dark'; // Orange/Kuning
      return 'badge bg-success text-white'; // Hijau
    },
    tambahStok() {
      // Validasi duplikasi kode sederhana
      const sdhAda = this.stok.some(item => item.kode.toUpperCase() === this.formBaru.kode.toUpperCase());
      if (sdhAda) {
        this.errorForm = "Error: Kode Mata Kuliah sudah ada di data sistem!";
        return;
      }
      
      // Push data ke array
      this.stok.push({
        kode: this.formBaru.kode.toUpperCase(),
        judul: this.formBaru.judul,
        kategori: this.formBaru.kategori,
        upbjj: this.formBaru.upbjj,
        lokasiRak: "R-NEW", 
        harga: 50000, // Default Dummy
        qty: this.formBaru.qty,
        safety: this.formBaru.safety,
        catatanHTML: "<span>Data Baru</span>"
      });

      // Reset form input
      this.formBaru = { kode: '', judul: '', kategori: '', upbjj: '', qty: 0, safety: 0 };
      this.errorForm = '';
    },
    resetFilter() {
      this.filterUPBJJ = '';
      this.filterKategori = '';
      this.filterKritis = false;
      this.sortBy = 'judul';
    }
  }
});