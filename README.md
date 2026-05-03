# BLM4538-Remoview

04.05.2026 - V5 Yapılanlar Video Linki (22290502-Batuhan Dede-IOS2 Dersi-03.05.2026-V5):
https://youtu.be/QLneU4OS81w

12.04.2026 - V4 Yapılanlar Video Linki (22290502-Batuhan Dede-IOS2 Dersi-12.04.2026-V4):
https://youtu.be/HJMU0hAufww

05.04.2026 - V3 Yapılanlar Video Linki (22290502-Batuhan Dede-IOS2 Dersi-05.04.2026-V3): 
https://youtu.be/PXCBP-Cj7lY

28.03.2026 - V2 Yapılanlar Video Linki (22290502-Batuhan Dede-IOS2 Dersi-28.03.2026-V2): https://youtu.be/hmM4diUB1TU

22.03.2026 - V1 Yapılanlar Video Linki (22290502-Batuhan Dede-IOS2 Dersi-22.03.2026-V1): https://youtu.be/qXAMpX2xh68


03.05.2026 Tarihli 22290502-Batuhan Dede - IOS2 Dersi-03.05.2026-V5 Videosundaki İlerlemeler:
Bu hafta projede kullanıcıların mobil uygulama üzerinden film ekleyebilmesi için film ekleme modülünü geliştirdim.Bu geliştirme için yeni bir AddFilmScreen oluşturdum. Bu ekran film adı, opsiyonel poster URL’i ve tür seçimi alanlarından oluşuyor. Kullanıcı filmi eklerken en az bir tür seçmek zorunda. Film adı da boş veya çok kısa girilirse kullanıcıya hata mesajı gösteriliyor. Film ekleme ekranında türleri sabit yazmadım. Backend tarafındaki /api/genres endpointinden dinamik olarak çekiyorum. Böylece backend’e yeni tür eklendiğinde mobil uygulama tarafında ekstra kod değişikliği yapmadan türler otomatik olarak ekranda görünebiliyor.



12.04.2026 Tarihli 22290502-Batuhan Dede - IOS2 Dersi-12.04.2026-V4 Videosundaki İlerlemeler:
Bu haftaki hedefim film detay ekranına puan verme sistemini eklemek ve kullanıcı yorumlarının mobil uygulama üzerinden backend’e gönderilmesini sağlamaktı. Yani kullanıcı artık bir filme 1 ile 5 arasında puan verebiliyor ve yorumunu göndererek bunu backend tarafında işletebiliyor.



05.04.2026 Tarihli 22290502-Batuhan Dede-IOS2 Dersi-05.04.2026-V3 Videosundaki İlerlemeler:
Bu hafta projenin 4. hafta hedefleri tamamlandı. Ana amaç, Film Detay ekranının geliştirilmesi ve kullanıcı ana sayfadaki herhangi bir filme tıkladığında o filmin detay sayfasına geçebilmesiydi.
Uygulamanın navigasyon yapısı genişletildi ve FilmDetail rotası eklendi. Böylece kullanıcı artık Home ekranındaki featured movie kartına ya da film listesinde yer alan herhangi bir film kartına tıklayarak detay ekranına geçebilmektedir.



28.03.2026 Tarihli 22290502-Batuhan Dede-IOS2 Dersi-28.03.2026-V2 Videosundaki İlerlemeler:
Bu hafta projenin 3. hafta hedefleri tamamlandı. Ana amaç, Ana Sayfa (Film Listesi) ekranının geliştirilmesi, backend’den onaylı filmlerin çekilmesi ve bu filmlerin React Native tarafında FlatList ile listelenmesi idi.
HomeScreen ekranı statik örnek yapıdan çıkarıldı ve dinamik hale getirildi.




22.03.2026 Tarihli 22290502-Batuhan Dede-IOS2 Dersi-22.03.2026-V1 Videosundaki İlerlemeler:

Bu videoda Remoview mobil uygulamasının React Native ile geliştirdiğim yeni sürümünde şu ana kadar yaptığım kısmı gösteriyorum. Bu proje aslında daha önce Flutter ile geliştirdiğim mobil uygulamanın ve .NET tarafında hazırladığım backend yapısının bu dönem React kullanılarak yeniden geliştirilmiş hali. Amacım eski projedeki mantığı koruyup aynı sistemi React Native tarafında yeniden kurmak.
İlk olarak proje kurulumunu yaptım. Yeni proje dizininde Expo tabanlı bir React Native uygulaması oluşturdum. Ardından GitHub reposunu hazırladım, remote bağlantısını kurdum ve yaptığım değişiklikleri düzenli commitlerle GitHub’a pushladım. Yani projenin versiyon kontrol tarafı da hazır hale getirildi.
Birinci hafta kapsamında temel ekran tasarımlarını oluşturdum. Şu anda uygulamada Splash ekranı, Login ekranı ve Home ekranının ilk versiyonu bulunuyor.


