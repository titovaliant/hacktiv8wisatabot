# 🧭 WisataBot – Asisten Perjalanan Indonesia

Chatbot berbasis AI untuk membantu perencanaan wisata di Indonesia, dibangun menggunakan **Google Gemini API**.

## ✨ Fitur

- 💬 Chat natural dalam **Bahasa Indonesia**
- 🗺️ Rekomendasi destinasi wisata
- 📅 Pembuatan itinerary perjalanan
- 🏨 Info hotel & penginapan
- 🍜 Rekomendasi kuliner lokal
- 💰 Tips budget traveling
- ⚡ Quick chips untuk pertanyaan populer
- 🧠 Conversation memory (konteks percakapan tersimpan)

## 🛠️ Teknologi

| Teknologi | Keterangan |
|-----------|-----------|
| HTML/CSS/JS | Frontend (Single Page App) |
| Google Gemini 2.0 Flash | Model LLM |
| Gemini REST API | AI backbone |
| localStorage | Simpan API key di browser |

## 🚀 Cara Menjalankan

### 1. Clone repositori
```bash
git clone https://github.com/titovaliant/hacktiv8wisatabot.git
cd wisatabot
```

### 2. Dapatkan Gemini API Key
- Buka [Google AI Studio](https://aistudio.google.com)
- Klik **Get API key** → **Create API key**
- Copy API key kamu

### 3. Jalankan aplikasi
Cukup buka file `index.html` di browser — **tidak perlu server**!

```bash
# Atau pakai live server sederhana:
python -m http.server 8000
# Buka: http://localhost:8000
```

### 4. Masukkan API Key
- Paste API key di kolom yang tersedia di bagian atas chatbot
- Klik **Simpan** — siap digunakan!

## 📸 User Interface

![WisataBot UI](screenshot.png)

## 💡 Contoh Pertanyaan

- *"Rekomendasikan destinasi wisata di Bali untuk 3 hari"*
- *"Berapa budget yang dibutuhkan untuk trip ke Lombok?"*
- *"Apa kuliner khas yang wajib dicoba di Yogyakarta?"*
- *"Buatkan itinerary Bandung 2 hari 1 malam"*

## ⚙️ Konfigurasi Parameter AI

| Parameter | Nilai | Keterangan |
|-----------|-------|-----------|
| Model | `gemini-2.0-flash` | Cepat & efisien |
| Temperature | `0.8` | Jawaban kreatif tapi tetap akurat |
| Max Output Tokens | `1024` | Jawaban detail |
| System Prompt | Custom | Fokus wisata Indonesia |

## 📁 Struktur Proyek

```
wisatabot/
├── index.html      # Aplikasi utama (all-in-one)
└── README.md       # Dokumentasi
```

## 👤 Author

Final Project – LLM-Based Tools and Gemini API Integration for Data Scientists  
Hacktiv8 Data Science Program
