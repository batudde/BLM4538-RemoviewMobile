# BLM4538-Remoview
28.03.2026 - V2 Yapılanlar Video Linki (22290502-Batuhan Dede-IOS2 Dersi-28.03.2026-V2):
22.03.2026 - V1 Yapılanlar Video Linki (22290502-Batuhan Dede-IOS2 Dersi-22.03.2026-V1): https://youtu.be/qXAMpX2xh68

28.03.2026 Tarihli 22290502-Batuhan Dede-IOS2 Dersi-28.03.2026-V2 Videosundaki İlerlemeler:
Bu hafta projenin 3. hafta hedefleri tamamlandı. Ana amaç, Ana Sayfa (Film Listesi) ekranının geliştirilmesi, backend’den onaylı filmlerin çekilmesi ve bu filmlerin React Native tarafında FlatList ile listelenmesi idi.
HomeScreen ekranı statik örnek yapıdan çıkarıldı ve dinamik hale getirildi.
Backend’deki GET /api/films endpointine bağlanılarak approved durumdaki filmler çekildi.
Film verilerini uygulama içinde düzenli kullanmak için Film tipi oluşturuldu.
Backend’den gelen ham veriyi uygulama modeline dönüştürmek için mapFilm yapısı eklendi.
API çağrılarını yönetmek için filmService.ts dosyasında film listeleme servisi yazıldı.
Ana sayfada filmler FlatList ile listelendi.
Her film kartında: afiş, film adı, tür bilgisi, ortalama puan gösterilecek şekilde arayüz düzenlendi.
Afiş olmayan filmler için fallback poster görünümü eklendi.
Kullanıcı deneyimi için: loading durumu, hata durumu, boş liste durumu, tekrar dene butonu, pull-to-refresh, destekleri eklendi.
Ana sayfanın üst kısmına, önceki Flutter sürümüne benzer şekilde bir Featured Movie kartı eklendi.
Eklenen / Güncellenen Dosyalar
src/screens/HomeScreen.tsx
src/services/filmService.ts
src/types/film.ts
Bu hafta sonunda ana sayfa ekranı backend ile entegre şekilde çalışır hale getirildi. Böylece kullanıcı artık sisteme giriş yaptıktan sonra backend’den gelen onaylı film listesini mobil uygulama üzerinde görüntüleyebilmektedir.





22.03.2026 Tarihli 22290502-Batuhan Dede-IOS2 Dersi-22.03.2026-V1 Videosundaki İlerlemeler:

Bu videoda Remoview mobil uygulamasının React Native ile geliştirdiğim yeni sürümünde şu ana kadar yaptığım kısmı gösteriyorum. Bu proje aslında daha önce Flutter ile geliştirdiğim mobil uygulamanın ve .NET tarafında hazırladığım backend yapısının bu dönem React kullanılarak yeniden geliştirilmiş hali. Amacım eski projedeki mantığı koruyup aynı sistemi React Native tarafında yeniden kurmak.
İlk olarak proje kurulumunu yaptım. Yeni proje dizininde Expo tabanlı bir React Native uygulaması oluşturdum. Ardından GitHub reposunu hazırladım, remote bağlantısını kurdum ve yaptığım değişiklikleri düzenli commitlerle GitHub’a pushladım. Yani projenin versiyon kontrol tarafı da hazır hale getirildi.
Birinci hafta kapsamında temel ekran tasarımlarını oluşturdum. Şu anda uygulamada Splash ekranı, Login ekranı ve Home ekranının ilk versiyonu bulunuyor. Tasarım kısmında önceki mobil uygulamanın sinematik ve koyu tema hissini korumaya çalıştım. Uygulama açıldığında önce splash ekranı geliyor, burada uygulama kısa süreli olarak session kontrolü yapıyor. Yani kullanıcı daha önce giriş yaptıysa bunu kontrol ediyor.
Birinci hafta kapsamında belirlediğim görevler hızlıca bittiği için ikinci hafta kapsamındaki görevlere başladım. Authentication tarafını geliştirdim. Login ve Register ekranlarının formlarını oluşturdum. Kullanıcı email ve şifre ile kayıt olabiliyor, ardından giriş yapabiliyor. Bu işlemler doğrudan daha önce geliştirdiğim .NET backend üzerindeki api/Auth/register ve api/Auth/login endpointlerine bağlanıyor. Login işlemi başarılı olduğunda backend bana JWT token döndürüyor. Bu token uygulama içinde local storage mantığıyla saklanıyor. Böylece kullanıcı uygulamayı tekrar açtığında oturum bilgisini kaybetmeden devam edebiliyor.
Bu aşamada sadece arayüzü hazırlamakla kalmadım, sistemi backend ile gerçek olarak da test ettim. Register isteğinin başarılı şekilde çalıştığını, login isteğinin JWT token döndürdüğünü ve hatalı girişte de doğru şekilde hata mesajı verdiğini doğruladım. Yani şu an 1. hafta ve 2. hafta hedefleri büyük ölçüde tamamlanmış durumda.


