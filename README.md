# BLM4538-Remoview
22.03.2026 - 1. ve 2. Hafta Yapılanlar Video Linki: https://youtu.be/qXAMpX2xh68

1) Proje Tanımı ve Amaç
Remoview, sinemaseverlerin filmleri keşfedebileceği, puanlayabileceği ve yorum yapabileceği bir topluluk platformudur. İlk dönem Flutter ile geliştirilen mimari, bu dönem React Native ekosistemine taşınarak performans ve kullanıcı deneyimi odaklı yeniden kodlanacaktır.:
• Film listesini görüntüleyebilir ve film detayına gidebilir
• Film puanlayabilir (rating)
• Film yorumlayabilir (review)
• Filmleri favorilerine ekleyip/çıkarabilir
• Profil ekranında favorilerini yönetebilir
Sistemin temel hedefi, web uygulamasındaki işlevleri mobil arayüze taşıyarak hızlı film keşfi ve etkileşim (puan/yorum/favori) sağlamaktır.


2) Kapsam
• Kimlik doğrulama (Register / Login / Logout)
• Film listeleme (sadece onaylı/approved içerikler)
• Film detay (ortalama puan + onaylı yorumlar)
• Puan verme / güncelleme
• Yorum gönderme (yorumlar moderasyon sürecinden geçer)
• Favori işlemleri (listeleme, ekleme, kaldırma)
• Temel arama/filtreleme UI desteği


3) Kullanıcı Akışı
1. Splash / Açılış
o Token kontrolü yapılır.
o Token varsa ana sayfaya; yoksa Login’e yönlendirilir.
2. Login / Register
o Kullanıcı e-posta ve şifreyle kayıt olur veya giriş yapar.
o Başarılı girişte JWT token güvenli şekilde saklanır.
3. Ana Sayfa (Filmler)
o Onaylı filmler listelenir.
o Film kartına tıklanınca film detay ekranı açılır.
4. Film Detay
o Afiş, başlık, türler, ortalama puan gösterilir.
o Kullanıcı puan verir / günceller.
o Kullanıcı yorum gönderir (pending’e düşer).
o Favoriye ekle/çıkar yapılabilir.
5. Profil
o Kullanıcının e-postası / hesap bilgisi gösterilir.
o Favori listesi listelenir.
o Favoriden çıkarma yapılabilir.
o Logout ile token temizlenir.


4) Ekranlar (UI Modülleri)
• Splash / Init
• Login
• Register
• Home / Discover (Film List)
• Film Detail
• Profile / Favorites
• Search / Filter sayfası


5) Kullanılacak Teknolojiler
• Framework: React Native (Expo Managed Workflow)
• State Management: React Context API veya Redux Toolkit
• Navigation: React Navigation (Stack & Tab Navigation)
• Networking: Axios (REST API Entegrasyonu)
• Storage: Expo Secure Store (JWT Token yönetimi için)
• UI/UX: Figma (Tasarım), React Native Paper / Elements


6) Backend Entegrasyonu ve Endpointler
Mobil uygulama Remoview backendi örnek endpoint seti:
Auth
•POST /api/auth/register
•POST /api/auth/login
Films
•GET /api/films → onaylı filmler
•GET /api/films/{id} → onaylı film detayı + onaylı yorumlar
•POST /api/films/{id}/ratings (Authorize)
•POST /api/films/{id}/reviews (Authorize; yorum pending) Favorites
•GET /api/favorites (Authorize)
•POST /api/favorites/{filmId} (Authorize)
•DELETE /api/favorites/{filmId} (Authorize)
Mobil tarafta kritik nokta: Authorization: Bearer {token} header’ı doğru set edilmezse “yetki yok/403” veya “unauthorized/401” alınır.


7) Haftalık Çalışma Planı
(Hafta 1-4)
•1. Hafta: Proje kurulumu, GitHub reposunun hazırlanması ve Figma üzerinde ekran tasarımlarının (Splash, Login, Home) tamamlanması.
•2. Hafta: Authentication (Kimlik Doğrulama) ekranlarının kodlanması. Register/Login formlarının oluşturulması ve JWT token yapısının kurulması.
•3. Hafta: Ana Sayfa (Film Listesi) UI tasarımı. Backend'den onaylı film listesinin çekilmesi ve FlatList ile listelenmesi.
•4. Hafta: Film Detay ekranının yapılması. Afiş, özet ve türlerin gösterilmesi. Vize sunumu hazırlığı.
(Hafta 5-10)
•5. Hafta: Puan verme (Rating) sisteminin entegrasyonu. Kullanıcının verdiği puanın API'ye gönderilmesi.
•6. Hafta: Yorum yapma (Review) modülünün kodlanması. Gönderilen yorumların "Pending" (onay bekliyor) statüsünde işlenmesi.
•7. Hafta: Favorilere Ekleme/Çıkarma fonksiyonlarının yazılması. Profil sayfasında favori listesinin dinamik olarak gösterilmesi.
•8. Hafta: Arama ve Filtreleme özelliklerinin eklenmesi. Kullanıcı profili güncelleme ve Logout işlemleri.
•9. Hafta: Performans optimizasyonları, genel testler.
•10. Hafta: Son video çekimi ve projenin yayına hazır hale getirilmesi.


8) Teknik Mimari
Auth Yönetimi: JWT token'lar güvenli bir şekilde saklanacak ve her isteğe Authorization: Bearer {token} header'ı eklenecektir.
Veri Modeli: Film, Rating, Review ve Favorite nesneleri backend üzerinden çekilen DTO'lara uygun olarak modellenecektir .
Görsel Önbellekleme: Afiş resimleri için hızlı yükleme amacıyla caching mekanizması kullanılacaktır.
