# BLM4538-Remoview
22.03.2026 - 1. ve 2. Hafta Yapılanlar Video Linki (22290502-Batuhan Dede-IOS2 Dersi-22.03.2026-V1): https://youtu.be/qXAMpX2xh68

22.03.2026 Tarihli 22290502-Batuhan Dede-IOS2 Dersi-22.03.2026-V1 Videosundaki İlerlemeler:

Bu videoda Remoview mobil uygulamasının React Native ile geliştirdiğim yeni sürümünde şu ana kadar yaptığım kısmı gösteriyorum. Bu proje aslında daha önce Flutter ile geliştirdiğim mobil uygulamanın ve .NET tarafında hazırladığım backend yapısının bu dönem React kullanılarak yeniden geliştirilmiş hali. Amacım eski projedeki mantığı koruyup aynı sistemi React Native tarafında yeniden kurmak.

İlk olarak proje kurulumunu yaptım. Yeni proje dizininde Expo tabanlı bir React Native uygulaması oluşturdum. Ardından GitHub reposunu hazırladım, remote bağlantısını kurdum ve yaptığım değişiklikleri düzenli commitlerle GitHub’a pushladım. Yani projenin versiyon kontrol tarafı da hazır hale getirildi.

Birinci hafta kapsamında temel ekran tasarımlarını oluşturdum. Şu anda uygulamada Splash ekranı, Login ekranı ve Home ekranının ilk versiyonu bulunuyor. Tasarım kısmında önceki mobil uygulamanın sinematik ve koyu tema hissini korumaya çalıştım. Uygulama açıldığında önce splash ekranı geliyor, burada uygulama kısa süreli olarak session kontrolü yapıyor. Yani kullanıcı daha önce giriş yaptıysa bunu kontrol ediyor.

Birinci hafta kapsamında belirlediğim görevler hızlıca bittiği için ikinci hafta kapsamındaki görevlere başladım. Authentication tarafını geliştirdim. Login ve Register ekranlarının formlarını oluşturdum. Kullanıcı email ve şifre ile kayıt olabiliyor, ardından giriş yapabiliyor. Bu işlemler doğrudan daha önce geliştirdiğim .NET backend üzerindeki api/Auth/register ve api/Auth/login endpointlerine bağlanıyor. Login işlemi başarılı olduğunda backend bana JWT token döndürüyor. Bu token uygulama içinde local storage mantığıyla saklanıyor. Böylece kullanıcı uygulamayı tekrar açtığında oturum bilgisini kaybetmeden devam edebiliyor.

Bu aşamada sadece arayüzü hazırlamakla kalmadım, sistemi backend ile gerçek olarak da test ettim. Register isteğinin başarılı şekilde çalıştığını, login isteğinin JWT token döndürdüğünü ve hatalı girişte de doğru şekilde hata mesajı verdiğini doğruladım. Yani şu an 1. hafta ve 2. hafta hedefleri büyük ölçüde tamamlanmış durumda.


