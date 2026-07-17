export interface TahlilSection {
  id: string;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  repeat?: number;
  repeatText?: string;
}

export interface TahlilData {
  sections: TahlilSection[];
}

export const tahlilData: TahlilData = {
  sections: [
    {
      id: "niyyat",
      title: "Niyyat Tahlil",
      arabic: "إِلَى حَضْرَةِ النَّبِيِّ الْمُصْطَفَى سَيِّدِنَا مُحمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ وَاٰلِهِ وَأَزْوَاجِهِ وَأَوْلَادِهِ وَذُرِّيَّاتِهِ الْفَــاتِحَةُ",
      latin: "Ilâ ḥaḍratin-nabiyyil-muṣṭafâ sayyidinâ Muḥammadin ṣallallâhu ʿalaihi wa sallama wa âlihi wa azwâjihi wa awlâdihi wa ḏurriyyâtihi al-fâtiḥah",
      translation: "Kepada yang terhormat Nabi Muhammad ﷺ, segenap keluarga, istri-istrinya, anak-anaknya, dan keturunannya. Bacaan Al-Fatihah ini kami tujukan kepada Allah dan pahalanya untuk mereka semua. Al-Fatihah…",
    },
    {
      id: "fatihah_1",
      title: "Al-Fatihah untuk Nabi dan Para Nabi/Rasul",
      arabic: "ثُمَّ إِلَى حَضْرَةِ إِخْوَانِهِ مِنَ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ وَالْأَوْلِيَاءِ وَالشُّهَدَاءِ وَالصَّالِحِيْنَ وَالصَّحَابَةِ وَالتَّابِعِيْنَ وَالْعُلَمَاءِ الْعَامِلِيْنَ وَالْمُصَنِّفِيْنَ الْمُخْلِصِيْنَ وَجَمِيْعِ الْمَلَائِكَةِ الْمُقَرَّبِيْنَ، خُصُوْصًا إِلَى سَيِّدِنَا الشَّيْخِ عَبْدِ الْقَادِرِ الْجِيْلَانِي وَخُصُوْصًا إِلَى مُؤَسِّسِيْ جَمْعِيَّةِ نَهْضَةِ الْعُلَمَاءِ الْفَــاتِحَةُ",
      latin: "Tsumma ilâ ḥaḍrati ikhwânihi minal-anbiyâ'i wal-mursalîn wal-auliyâ'i wasy-syuhadâ'i wash-shâlihîn wash-shaḥâbati wat-tâbi'în wal-'ulamâ'il-'âmilîn wal-mushannifînal-mukhlishîn wa jamî'il-malâikatil-muqarrabîn, khusûshan ilâ sayyidinâsy-syaikh 'Abdil Qâdir al-Jîlânî wa khushûshan ilâ muassisî jam'iyyah Nahdlatil Ulama, al-fâtiḥah",
      translation: "Lalu kepada segenap saudara beliau dari kalangan para nabi, rasul, wali, syuhada, orang-orang saleh, sahabat, tabi'in, ulama al-amilin (yang mengamalkan ilmunya), ulama penulis yang ikhlas, semua malaikat Muqarrabin, terkhusus kepada Syekh Abdul Qadir al-Jilani dan para pendiri organisasi Nahdlatul Ulama. Bacaan Al-Fatihah ini kami tujukan kepada Allah dan pahalanya untuk mereka semua. Al-Fatihah.",
    },
    {
      id: "fatihah_2",
      title: "Al-Fatihah untuk Semua Ahli Kubur Muslim/Mukmin",
      arabic: "ثُمَّ إِلَى جَمِيْعِ أَهْلِ الْقُبُوْرِ مِنَ الْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ مِنْ مَشَارِقِ الْأَرْضِ إِلَى مَغَارِبِهَا بَرِّهَا وَبَحْرِهَا خُصُوْصًا إِلَى اٰبَائِنَا وَأُمَّهَاتِنَا وَأَجْدَادِنَا وَجَدَّاتِنَا وَمَشَايِخِنَا وَمَشَايِخِ مَشَايِخِنَا وَأَسَاتِذَةِ أَسَاتِذَتِنَا وَلِمَنْ أَحْسَنَ إِلَيْنَا وَلِمَنِ اجْتَمَعْنَا هٰهُنَا بِسَبَبِهِ الْفَاتِحَةُ",
      latin: "Tsumma ilâ jamî'i ahlil-qubûri minal-muslimîna wal-muslimâti wal-mu'minîna wal-mu'minâti min masyâriqil-ardli ilâ maghâribihâ barrihâ wa baḥrihâ khushushan ilâ âbâ'inâ wa ummahâtinâ wa ajdâdinâ wa jaddâtinâ wa masyâyikhinâ wa masyâyikhi masyâyikhinâ wa asâtidzati asâtidzatinâ wa liman aḥsana ilainâ wa liman ijtama'nâ hâhunâ bisababihi, al-fâtiḥah",
      translation: "Kemudian kepada semua ahli kubur Muslimin, Muslimat, Mukminin, Mukminat dari Timur ke Barat, baik di laut dan di darat, khususnya bapak kami, ibu kami, kakek kami, nenek kami, guru kami, pengajar dari guru kami, mereka yang telah berbuat baik kepada kami, dan bagi ahli kubur/arwah yang menjadi sebab kami berkumpul di sini. Bacaan Al-Fatihah ini kami tujukan kepada Allah dan pahalanya untuk mereka semua. Al-Fatihah.",
    },
    {
      id: "fatihah_3",
      title: "Al-Fatihah untuk Arwah yang Disebutkan Namanya",
      arabic: "ثُمَّ إِلَى جَمِيْعِ أهْلِ الْقُبُوْرِ مِمَّنْ ذُكِرَتْ أَسْمَاؤُهُ فِيْ هٰذِهِ الرِّسَالَةِ حَضْرَةِ رُوْحِ …، وَحَضْرَةِ رُوْحِ …، وَحَضْرَةِ رُوْحِ …، رَحِمَهُمُ اللهُ وَغَفَرَهُمْ، الْفَاتِحَةُ",
      latin: "Tsumma ilâ jamî'i ahlil-qubûri mimman dzukirat asmâ'uhu fî hâdzihir-risâlati, ḥaḍrati rûḥi…, wa ḥaḍrati rûḥi…, wa ḥaḍrati rûḥi…, raḥimahumullâhu wa ghafarahum, al-fâtiḥah",
      translation: "Kemudian kepada semua ahli kubur, yang namanya disebutkan dalam risalah ini. Kepada…, dan kepada…, dan kepada…. Semoga Allah merahmati dan mengampuni mereka. Bacaan Al-Fatihah ini kami tujukan kepada Allah dan pahalanya untuk mereka semua. Al-Fatihah.",
    },
    {
      id: "surah_ikhlas",
      title: "Surah Al-Ikhlas (3x)",
      arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، قُلْ هُوَ اللّٰهُ اَحَدٌۚ، اَللّٰهُ الصَّمَدُۚ، لَمْ يَلِدْ وَلَمْ يُوْلَدْۙ، وَلَمْ يَكُنْ لَّهٗ كُفُوًا اَحَـــــدٌ ×٣",
      latin: "Bismillâhir-raḥmânir-raḥîm(i), Qul huwallâhu aḥad, Allâhush-shamad, lam yalid wa lam yûlad, wa lam yakul lahû kufuwan aḥad. 3x",
      translation: "Dengan menyebut nama Allah yang maha pengasih lagi maha penyayang. Katakanlah (Muhammad), \"Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. (Allah) tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu yang setara dengan Dia.\" (3 kali).",
      repeat: 3,
      repeatText: "3 kali"
    },
    {
      id: "la_ilaha_1",
      title: "Laa Ilaha Illallah",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lâ ilâha illâllâhu wallâhu akbar",
      translation: "Tiada tuhan yang layak disembah kecuali Allah. Allah maha besar.",
    },
    {
      id: "surah_falaq",
      title: "Surah Al-Falaq",
      arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، قُلْ اَعُوْذُ بِرَبِّ الْفَلَقِۙ، مِنْ شَرِّ مَـــا خَلَقَۙ، وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَۙ، وَمِنْ شَرِّ النَّفّٰثٰتِ فِى الْعُقَدِۙ، وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ",
      latin: "Bismillâhir-raḥmânir-raḥîm(i), Qul a'ûdzu bi rabbil-falaq, min syarri mâ khalaq, wa min syarri ghâsiqin idzâ waqab, wa min syarrin-naffâtsâti fîl-'uqad, wa min syarri ḥâsidin idzâ ḥasad",
      translation: "Dengan menyebut nama Allah yang maha pengasih lagi maha penyayang. Katakanlah, \"Aku berlindung kepada Tuhan yang menguasai subuh (fajar), dari kejahatan (makhluk yang) Dia ciptakan, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan (perempuan-perempuan) penyihir yang meniup pada buhul-buhul (talinya), dan dari kejahatan orang yang dengki apabila dia dengki.\"",
    },
    {
      id: "la_ilaha_2",
      title: "Laa Ilaha Illallah",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lâ ilâha illâllâhu wallâhu akbar",
      translation: "Tiada tuhan yang layak disembah kecuali Allah. Allah maha besar.",
    },
    {
      id: "surah_nas",
      title: "Surah An-Nas",
      arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، قُلْ اَعُوْذُ بِرَبِّ النَّاسِۙ، مَلِكِ النَّـــاسِۙ، اِلٰهِ النَّاسِۙ، مِنْ شَرِّ الْوَسْوَاسِ ەۙ الْخَنَّاسِۖ، الَّذِيْ يُوَسْوِسُ فِيْ صُدُوْرِ النَّاسِۙ، مِنَ الْجِنَّةِ وَالنَّــاسِ",
      latin: "Bismillâhir-raḥmânir-raḥîm(i), Qul a'ûdzu bi rabbin-nâs, malikin-nâs, ilâhin-nâs, min syarril-waswâsil khannâs, alladzî yuwaswisu fî shudûrin-nâs, minal-jinnati wan-nâs.",
      translation: "Dengan menyebut nama Allah yang maha pengasih lagi maha penyayang. Katakanlah, \"Aku berlindung kepada Tuhannya manusia, raja manusia, sembahan manusia, dari kejahatan (bisikan) setan yang bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia.\""
    },
    {
      id: "la_ilaha_3",
      title: "Laa Ilaha Illallah",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ",
      latin: "Lâ ilâha illâllâhu wallâhu akbar",
      translation: "Tiada tuhan yang layak disembah kecuali Allah. Allah maha besar.",
    },
    {
      id: "surah_fatihah",
      title: "Surah Al-Fatihah",
      arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ، الرَّحْمٰنِ الرَّحِيْمِۙ، مٰلِكِ يَوْمِ الدِّيْنِۗ، اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِيْنُۗ، اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيْمَۙ، صِرَاطَ الَّذِيْنَ اَنْعَمْتَ عَلَيْهِمْ ەۙ غَيْرِ الْمَغْضُوْبِ عَلَيْهِمْ وَلَا الضَّاۤلِّيْنَ",
      latin: "Bismillâhir-raḥmânir-raḥîm(i), al-ḥamdu lillâhi rabbil-'âlamîn, Ar-raḥmânir-raḥîm, mâliki yaumid-dîn, iyyâka na'budu wa iyyâka nasta'în, ihdinâsh-shirâthal-mustaqîm, shirâthal-ladzîna an'amta 'alaihim ghairil-maghdlûbi 'alaihim wa lâdl-dlâllîn. Âmîn",
      translation: "Dengan menyebut nama Allah yang maha pengasih lagi maha penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang maha pengasih lagi maha penyayang. Yang menguasai hari pembalasan. Hanya kepada-Mu kami menyembah. Hanya kepada-Mu pula kami memohon pertolongan. Tunjukkanlah kami ke jalan yang lurus, yaitu jalan orang-orang yang telah Kauanugerahi nikmat kepada mereka, bukan jalan mereka yang dimurkai dan bukan pula jalan mereka yang sesat. Semoga Kaukabulkan permohonan kami.",
    },
    {
      id: "surah_baqarah_1_5",
      title: "Surah Al-Baqarah Ayat 1-5",
      arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ، الۤــــــمّۤۚ، ذٰلِكَ الْكِتٰبُ لَا رَيْبَۛ فِيْهِۛ هُدًى لِّلْمُتَّقِيْنَۙ، الَّذِيْنَ يُؤْمِنُوْنَ بِالْغَيْبِ وَيُقِيْمُوْنَ الصَّلٰوةَ وَمِمَّا رَزَقْنٰهُمْ يُنْفِقُوْنَۙ، وَالَّذِيْنَ يُؤْمِنُوْنَ بِمَآ اُنْزِلَ اِلَيْكَ وَمَآ اُنْزِلَ مِنْ قَبْلِكَ ۚ وَبِالْاٰخِرَةِ هُمْ يُوْقِنُوْنَۗ، اُولٰۤىِٕكَ عَلٰى هُدًى مِّنْ رَّبِّهِمْۙ وَاُولٰۤىِٕكَ هُمُ الْمُفْلِحُوْنَ",
      latin: "Bismillâhir-raḥmânir-raḥîm(i), Alif Lâm Mîm, dzâlikal-kitâbu lâ raiba fîhi, hudal-lil-muttaqîn, al-ladzîna yu'minûna bil-ghaibi wa yuqîmûnash-shalâta wa mimmâ razaqnâhum yunfiqûn, wal-ladzîna yu'minûna bimâ unzila ilaika wa mâ unzila min qablika, wa bil-âkhirati hum yûqinûn, ulâ'ika 'alâ hudam mir rabbihim wa ulâ'ika humul-mufliḥûn.",
      translation: "Dengan menyebut nama Allah yang maha pengasih lagi maha penyayang. Alif lam mim. Demikian itu kitab ini tidak ada keraguan padanya. Sebagai petunjuk bagi mereka yang bertakwa. Yaitu mereka yang beriman kepada yang gaib, yang mendirikan shalat, dan menafkahkan sebagian rezeki yang Kami anugerahkan kepada mereka. Dan mereka yang beriman kepada kitab Al-Qur'an yang telah diturunkan kepadamu (Muhammad ﷺ) dan kitab-kitab yang telah diturunkan sebelumnya, serta mereka yakin akan adanya kehidupan akhirat. Mereka itulah yang tetap mendapat petunjuk dari Tuhannya. Merekalah orang-orang yang beruntung.",
    },
    
    {
      id: "wa-ilahukum",
      title: "Ayat Wa Ilâhukum Ilâhun Wâḥid",
      arabic: "وَإِلٰهُكُمْ إِلٰهٌ وَّاحِدٌ لَا إِلٰهَ إِلَّا هُوَ الرَّحْمٰنُ الرَّحِيمُ",
      latin: "Wa ilâhukum ilâhuw wâḥidul lâ ilâha illâ Huwar-raḥmânur-raḥîm.",
      translation: "Dan Tuhan kalian adalah Tuhan yang maha esa. Tiada tuhan yang layak disembah kecuali Dia yang maha pengasih lagi maha penyayang.",
    },
    {
      id: "ayat_kursi",
      title: "Ayat Kursi",
      arabic: "اَللّٰهُ لَآ اِلٰهَ اِلَّا هُوَۚ اَلْحَيُّ الْقَيُّوْمُ ەۚ لَا تَأْخُذُهٗ سِنَةٌ وَّلَا نَوْمٌۗ لَهٗ مَا فِى السَّمٰوٰتِ وَمَا فِى الْاَرْضِۗ مَنْ ذَا الَّذِيْ يَشْفَعُ عِنْدَهٗٓ اِلَّا بِاِذْنِهٖۗ يَعْلَمُ مَا بَيْنَ اَيْدِيْهِمْ وَمَا خَلْفَهُمْۚ وَلَا يُحِيْطُوْنَ بِشَيْءٍ مِّنْ عِلْمِهٖٓ اِلَّا بِمَا شَاۤءَۚ وَسِعَ كُرْسِيُّهُ السَّمٰوٰتِ وَالْاَرْضَۚ وَلَا يَـُٔوْدُهٗ حِفْظُهُمَاۚ وَهُوَ الْعَلِيُّ الْعَظِيْمُ",
      latin: "Allâhu lâ ilâha illâ huwal-ḥayyul-qayyûm(u). Lâ ta'khudzuhû sinatuw wa lâ naûm(u). Lahû mâ fis-samâwâti wa mâ fil-ardl. Man dzal-ladzî yasyfa'u 'indahû illâ bi idznih(i). Ya'lamu mâ baina aidîhim wa mâ khalfahum. Wa lâ yuḥîthûna bi syai'in min 'ilmihî illâ bimâ syâ'a wasi'a kursiyyuhus-samâwâti wal-ardl. Wa lâ ya'ûduhu ḥifdhuhumâ wa huwal-'aliyyul-'adhîm.",
      translation: "Allah, tiada yang layak disembah kecuali Dia yang hidup kekal lagi berdiri sendiri. Tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan di bumi. Tiada yang dapat memberikan syafaat di sisi-Nya kecuali dengan izin-Nya. Dia mengetahui apa yang ada di hadapan dan di belakang mereka. Mereka tidak mengetahui sesuatu dari ilmu-Nya kecuali apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dia tidak merasa berat menjaga keduanya. Dia maha tinggi lagi maha agung.",
    },
    {
      id: "istighfar",
      title: "Istighfar (3x)",
      arabic: "أَسْتَغْفِرُ اللهَ الْعَـــظِيْمَ ×٣",
      latin: "Astaghfirullâhal-'adhîm. 3x",
      translation: "Saya mohon ampun kepada Allah yang maha agung (3 kali).",
      repeat: 3,
      repeatText: "3 kali"
    },
    {
      id: "dzikir_1",
      title: "Dzikir: Sebaik-baik Dzikir",
      arabic: "أَفْضَلُ الذِّكْرِ فَاعْلَمْ أَنَّهُ لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ مَوْجُوْدٌ",
      latin: "Afdlaludz-dzikri fa'lam annahu lâ ilâha illallâhu, ḥayyun maujûd(un)",
      translation: "Sebaik-baik dzikir – ketahuilah – adalah lafal 'Lâ ilâha illallâh', tiada tuhan selain Allah, Dzat yang Mahahidup dan Wujud.",
    },
    {
      id: "la_ilaha_hayy_ma'bud",
      title: "Laa Ilaha Illallah - Hayyun Ma'bud",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ، حَيٌّ مَعْبُوْدٌ",
      latin: "Lâ ilâha illâllâhu, ḥayyun ma'bûd",
      translation: "Tiada tuhan selain Allah, Dzat yang mahahidup dan disembah.",
    },
    {
      id: "la_ilaha_hayy_baqi",
      title: "Laa Ilaha Illallah - Hayyun Baqi",
      arabic: "لَاَ إِلٰهَ إِلَّا اللهُ، حَيٌّ بَاقٍ",
      latin: "Lâ ilâha illâllâhu, ḥayyun bâq",
      translation: "Tiada tuhan selain Allah, Dzat yang Mahahidup dan kekal.",
    },
    {
      id: "la_ilaha_100x",
      title: "Laa Ilaha Illallah (100x)",
      arabic: "لَا إِلٰهَ إِلَّا اللهُ ×١٠٠",
      latin: "Lâ ilâha illâllâh. 100x",
      translation: "Tiada tuhan selain Allah (100 kali).",
      repeat: 100,
      repeatText: "100 kali"
    },
    {
      id: "sholawat_1",
      title: "Sholawat Nabi (2x)",
      arabic: "اَللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ اَللّٰهُمَّ صَلِّ عَلَيْهِ وَسَلِّمْ ×٢",
      latin: "Allâhumma shalli 'alâ sayyidinâ Muḥammadin, Allâhumma shalli 'alaihi wa sallim. 2x",
      translation: "Ya Allah, limpahkan rahmat takzim dan keselamatan kepada pemimpin kami, Nabi Muhammad (2 kali).",
      repeat: 2,
      repeatText: "2 kali"
    },
    {
      id: "tasbih_1",
      title: "Tasbih: Subhanallah Adada Ma Khalaqallah (7x)",
      arabic: "سُبْحَــانَ اللهِ عَدَدَ مَـــا خَلَقَ اللهُ ×٧",
      latin: "Subḥânallâhi 'adada mâ khalaqallâhu. 7x",
      translation: "Mahasuci Allah sebanyak makhluk yang Allah ciptakan (7 kali).",
      repeat: 7,
      repeatText: "7 kali"
    },
    {
      id: "tasbih_2",
      title: "Tasbih: Subhanallah Wabihamdihi Subhanallahil Adhim (33x)",
      arabic: "سُبحَانَ اللهِ وَبِحَمْدِهِ سُبْحَانَ اللهِ الْعَظِيْمِ ×٣٣",
      latin: "Subḥânallâhi wa biḥamdihi, subḥânallâhil-'adhîm. 33x",
      translation: "Mahasuci Allah dengan segala pujian untuk-Nya. Mahasuci Allah yang Mahaagung (33 kali).",
      repeat: 33,
      repeatText: "33 kali"
    },
    {
      id: "sholawat_2",
      title: "Sholawat Nabi dan Keluarga/Sahabat (2x)",
      arabic: "اَللّٰهُمَّ صَلِّ عَلَى حَبِيْبِكَ سَيِّدِنَا مُحَمَّدٍ وَعَلَى اٰلِهِ وَصَحْبِهِ وَسَلِّمْ ×٢",
      latin: "Allâhumma shalli 'alâ ḥabîbika sayyidinâ Muḥammadin wa âlihi wa shaḥbihi wa sallim. 2x",
      translation: "Ya Allah, limpahkan rahmat takzim dan keselamatan kepada kekasih-Mu, pemimpin kami, Nabi Muhammad, berikut keluarga dan sahabatnya (2 kali).",
      repeat: 2,
      repeatText: "2 kali"
    },
    {
      id: "sholawat_3",
      title: "Sholawat Lengkap dengan Berkah",
      arabic: "اَللّٰهُمَّ صَلِّ عَلَى حَبِيْبِكَ سَيِّدِنَا مُحَمَّدٍ وَعَلَى اٰلِهِ وَصَحْبِهِ وَبَارِكْ وَسَلِّمْ أَجْمَعِيْنَ",
      latin: "Allâhumma shalli 'alâ ḥabîbika sayyidinâ Muḥammadin wa 'alâ âlihi wa shaḥbihi wa bârik wa sallim ajma'în",
      translation: "Ya Allah, limpahkanlah rahmat kepada kekasih-Mu, pemimpin kami, Nabi Muhammad, berikut keluarga dan sahabatnya. Limpahkanlah pula berkah dan keselamatan kepada mereka semua.",
    },
    {
      id: "doa_1",
      title: "Doa Penutup Tahlil",
      arabic: "أَعُوْذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ، بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ، الْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ، حَمْدَ الشَّاكِرِيْنَ حَمْدَ النَّاعِمِيْنَ، حَمْدًا يُّوَافِي نِعَمَهُ وَيُكَافِئُ مَزِيْدَهُ، يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِيْ لِجَلَالِ وَجْهِكَ وَعَظِيْمِ سُلْطَانِكَ، اللّٰهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَّعَلَى اٰلِ سَيِّدِنَا مُحَمَّدٍ",
      latin: "A'ûdzubillâhi minasy-syaithânir-rajîm, bismillâhir-raḥmânir-raḥîm, al-ḥamdulillâhi rabbil-'alamîn, ḥamdasy-syâkirîn, ḥamdan nâ'imîn, ḥamdan yuwâfî ni'amahu wa yukâfi'u mazîdah(u), yâ rabbanâ lakal-ḥamdu kamâ yanbaghî lijalâli wajhika wa 'adhîmi sulthânika, Allâhumma shalli 'alâ sayyidinâ Muḥammadin wa 'alâ âli sayyidinâ Muḥammadin.",
      translation: "Aku berlindung diri kepada Engkau dari setan yang dirajam. Dengan nama Allah yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan seru sekalian alam, sebagaimana orang-orang yang bersyukur dan orang yang memperoleh nikmat sama memuji, dengan pujian yang sesuai dengan nikmat-Nya dan memungkinkan ditambah nikmat-Nya. Tuhan kami, hanya Engkau segala puji, sebagaimana yang patut terhadap kemuliaan Engkau dan keagungan Engkau. Ya Allah, tambahkanlah kesejahteraan dan keselamatan kepada penghulu kami Nabi Muhammad dan kepada keluarganya.",
    },
    {
      id: "doa_2",
      title: "Doa Permintaan Pahala Tahlil",
      arabic: "اَللّٰهُمَّ تَقَبَّلْ وَأَوْصِلْ ثَوَابَ مَا قَرَاْنَاهُ مِنَ الْقُرْآنِ الْعَظِيْمِ وَمَا هَلَّلْنَا وَمَا سَبَّحْنَا وَمَا اسْتَغْفَرْنَا وَمَا صَلَّيْنَا عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ هَدِيَّةً وَاصِلَةً وَرَحْمَةً نَازِلَةً وَبَرَكَةً شَامِلَةً إِلَى حَضَرَةِ حَبِيْبِنَا وَشَفِيْعِنَا وَقُرَّةِ أَعْيُنِنَا سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَإِلَى جَمِيْعِ إِخْوَانِهِ مِنَ الْأَنْبِيَاءِ وَالْمُرْسَلِيْنَ وَالْأَوْلِيَاءِ وَالشُّهَدَاءِ وَالصَّالِحِيْنَ وَالصَّحَابَةِ وَالتَّابِعِيْنَ وَالْعُلَمَاءِ الْعَامِلِيْنَ وَالْمُصَنِّفِيْنَ الْمُخْلِصِيْنَ وَجَمِيْعِ الْمُجَاهِدِيْنَ فِي سَبِيْلِ اللهِ رَبِّ الْعَلَمِيْنَ وَالْمَلَائِكَةِ الْمُقَرَّبِيْن، خُصُوْصًا إِلَى سَيِّدِنَا الشَّيْخِ عَبْدِ الْقَادِرِ الْجِيْلَانِيّ، ثُمَّ إِلَى أَرْوَاحِ جَمِيْعِ أَهْلِ الْقُبُوْرِ مِنَ الْمُسْلِمِيْنَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِيْنَ وَالْمُؤْمِنَاتِ مِنْ مَشَارِقِ الْأَرْضِ وَمَغَارِبِهَا بَرِّهَا وَبَحْرِهَا خُصُوْصًا إِلَى آبَائِنَا وَاُمَّهَاتِنَا وَأَجْدَادِنَا وَجَدَّاتِنَا، وَنَخَصُّ خَصُوْصًا إِلَى مَنِ اجْتَمَعْنَا هٰهُنَا بِسَبَبِهِ وَلِأَجْلِهِ",
      latin: "Allâhumma taqabbal wa aushil tsawâba mâ qara'nâhu minal-qur'ânil-'adhîmi wa mâ hallalnâ wa mâ sabbaḥnâ wa mâstaghfarnâ wa mâ shallainâ 'alâ sayyidinâ Muḥammadin shallallâhu 'alaihi wa sallamâ, hadiyyatan wâshilatan wa raḥmatan nâzilatan wa barakatan syâmilatan ilâ ḥadlrati ḥabîbinâ wa syafî'inâ wa qurrati a'yuninâ sayyidinâ wa maulânâ Muḥammadin shallallâhu 'alaihi wa sallam, wa ilâ jamî'i ikhwânihi minal-anbiyâ'i wal-mursalîna wal-auliyâ'i wasy-syuhadâ'i wash-shâliḥîna wash-shaḥâbati wat-tâbi'îna wal-'ulamâ'il-'âmilîna wal-mushannifînal-mukhlashîna wa jamî'il-mujâhidîna fî sabîlillâhi rabbil-'âlamîna wal-malâ'ikatil-muqarrabîna, khusûshan ilâ sayyidinâsy-Syaikhi 'Abdil Qâdir al-Jîlânî, tsumma ilâ arwâḥi jamî'i ahlil-qubûri minal-muslimîna wal-muslimâti wal-mu'minîna wal-mu'minâti min masyâriqil-ardli wa maghâribihâ barrihâ wa baḥrihâ khusûshan ilâ âbâ'inâ wa ummahâtinâ wa ajdâdinâ wa jaddâtinâ, wa nakhushshu khusûshan ilâ man ijtama'nâ hâhunâ bisababihi wa li'ajlihi.",
      translation: "Ya Allah, terimalah dan sampaikanlah pahala ayat-ayat Al-Qur'anul 'Adhim yang telah kami baca, tahlil kami, tasbih dan istighfar kami, dan bacaan shalawat kami kepada penghulu kami Nabi Muhammad dan kepada keluarganya. Sebagai hadiah yang bisa sampai, rahmat yang turun, dan berkah yang cukup kepada kekasih kami, penolong dan buah mata kami, penghulu dan pemimpin kami, yaitu Nabi Muhammad ﷺ, kepada semua saudaranya dari para nabi dan rasul, kepada para wali, syuhada, orang-orang saleh, para sahabat, dan tabi'in; kepada para ulama yang mengamalkan ilmunya, para pengarang yang ikhlas, kepada semua pejuang di jalan Allah, Tuhan seru sekalian alam; dan kepada para malaikat Muqarrabin, terutama Syekh Abdul Qadir al-Jilani, kemudian kepada arwah seluruh ahli kubur Muslimin, Muslimat, Mukminin, Mukminat, dari timur ke barat di darat dan di laut, terutama lagi kepada bapak-bapak kami, ibu-ibu kami, kakek dan nenek kami, dan lebih khusus lagi kepada orang yang menyebabkan kami sekalian berkumpul di sini.",
    },
    {
      id: "doa_3",
      title: "Doa Ampunan untuk Arwah",
      arabic: "اَللّٰهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَعَافِهِمْ وَاعْفُ عَنْهُمْ، اَللّٰهُمَّ أَنْزِلِ الرَّحْمَةَ وَالْمَغْفِرَةَ عَلَى أَهْلِ الْقُبُوْرِ مِنْ أَهْلِ لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَّسُوْلُ اللهِ",
      latin: "Allâhummaghfir lahum warḥamhum wa 'âfihim wa'fu 'anhum, Allâhumma anzilir-raḥmata wal-maghfirata 'alâ ahlil-qubûri min ahli lâ ilâha illallâhu Muḥammadur-rasûlullâh",
      translation: "Ya Allah, ampunilah mereka, kasihanilah mereka, dan maafkanlah mereka. Ya Allah, turunkanlah rahmat dan ampunan kepada ahli kubur yang mengucapkan 'Lâ ilâha illallâh, Muḥammadur rasûlullâh' (Tidak ada tuhan selain Allah, Muhammad utusan Allah).",
    },
    {
      id: "doa_4",
      title: "Doa Penutup",
      arabic: "رَبَّنَا أَرِنَا الْحَقَّ حَقًّا وَّارْزُقْنَا اتِّبَاعَهُ، وَأَرِنَا الْبَاطِلَ بَاطِلًا وَّارْزُقْنَا اجْتِنَابَهُ، رَبَّنَا اٰتِنَا فِي الدُّنْيَا حَسَنَةً وَّفِي الْآخِرَةِ حَسَنَةً وَّقِنَا عَذَابَ النَّارِ، سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُوْنَ وَسَلَامٌ عَلَى الْمُرْسَلِيْنَ وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَلَمِيْنَ، اَلْفَاتِحَة",
      latin: "Rabbanâ arinal-ḥaqqa ḥaqqan warzuqnat-tibâ'ah, wa arinal-bâthila bâthilan warzuqnaj-tinâbah. Rabbanâ âtinâ fid-dunyâ ḥasanatan wa fil-âkhirati ḥasanatan wa qinâ 'adzâban-nâr. Subḥâna rabbika rabbil-'izzati 'ammâ yashifûn, wa salâmun 'alal-mursalîn, wal-ḥamdulillâhi rabbil-'âlamîn. Al-fâtiḥah.",
      translation: "Tuhan kami, tunjukkanlah kami kebenaran dengan jelas dan jadikanlah kami pengikutnya, tunjukkanlah kami perkara batil dengan jelas dan jadikanlah kami menjauhinya. Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, dan jagalah kami dari siksa api neraka. Maha Suci Tuhanmu, Tuhan yang bersih dari sifat yang disifatkan oleh orang-orang kafir, semoga keselamatan tetap dilimpahkan kepada para rasul, dan segala puji bagi Allah, Tuhan semesta alam. Al-Fatihah.",
    }
  ]
};