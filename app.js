// ══════════════════════════════════════════════
// أكواد الاستعلام الائتماني المصري — app.js
// ══════════════════════════════════════════════
import Fuse from './vendor/fuse.esm.js';

// ══ DATA — كل البيانات مدمجة في الملف مباشرة ══
const BASE_DATA = [
  {id:1,name:"البنك المركزي المصري",code:"RA00990001",category:"بنك عام",source:"أكواد الاستعلام 2025"},
  {id:2,name:"بنك الإسكندرية",code:"PC01000001",category:"بنك عام",source:"أكواد الاستعلام 2025"},
  {id:3,name:"البنك الأهلي المصري",code:"PC02000001",category:"بنك عام",source:"أكواد الاستعلام 2025"},
  {id:4,name:"بنك القاهرة",code:"PC03000001",category:"بنك عام",source:"أكواد الاستعلام 2025"},
  {id:5,name:"بنك مصر",code:"PC04000001",category:"بنك عام",source:"أكواد الاستعلام 2025"},
  {id:6,name:"البنك العقاري المصري العربي",code:"SB77000001",category:"بنك متخصص",source:"أكواد الاستعلام 2025"},
  {id:7,name:"بنك التنمية الصناعية المصري",code:"SB80000001",category:"بنك متخصص",source:"أكواد الاستعلام 2025"},
  {id:8,name:"البنك الزراعي المصري",code:"SB82010001",category:"بنك متخصص",source:"أكواد الاستعلام 2025"},
  {id:9,name:"المصرف المتحد",code:"CB12800001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:10,name:"المصرف المتحد",code:"CB01280001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:11,name:"البنك التجاري الدولي - مصر",code:"CB13000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:12,name:"بنك بلوم - مصر",code:"CB14000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:13,name:"بنك الإمارات دبي الوطني",code:"CB15000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:14,name:"بنك قناة السويس",code:"CB17000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:15,name:"بنك عودة",code:"CB19000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:16,name:"البنك الأهلي المتحد",code:"CB20000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:17,name:"بنك فيصل الإسلامي (البنك الوطني للتنمية)",code:"CB23000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:18,name:"البنك الأهلي الكويتي (بيريوس)",code:"CB24000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:19,name:"مصرف أبو ظبي الإسلامي",code:"CB25000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:20,name:"مصرف أبو ظبي الإسلامي",code:"CB25010001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:21,name:"بنك البركة",code:"CB26000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:22,name:"بنك الكويت الوطني",code:"CB27000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:23,name:"بنك الاتحاد الوطني - مصر",code:"CB30000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:24,name:"البنك المصري الخليجي",code:"CB32000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:25,name:"بنك اتش اس بي سي - مصر",code:"CB33000001",category:"بنك تجاري",source:"أكواد الاستعلام 2025"},
  {id:26,name:"التجاري وفا بنك ايجبت (باركليز)",code:"IB41000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:27,name:"بنك مصر ايران للتنمية",code:"IB42000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:28,name:"بنك الشركة المصرفية العربية الدولية",code:"IB43000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:29,name:"بنك كريدي اجريكول - مصر",code:"IB44000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:30,name:"بنك قطر الوطني الأهلي (سوسيتيه جنرال)",code:"IB45000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:31,name:"بنك الاستثمار العربي",code:"IB46000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:32,name:"بنك التعمير والإسكان",code:"IB47000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:33,name:"بنك المؤسسة العربية المصرفية",code:"IB49000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:34,name:"البنك المصري لتنمية الصادرات",code:"IB50000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:35,name:"البنك العربي الافريقي الدولي",code:"IB54000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:36,name:"بنك كريدي السويس فيرست",code:"IB56000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:37,name:"جمال ترست بنك",code:"IB58000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:38,name:"لويدز بنك بي ال سي",code:"IB60000001",category:"بنك استثماري",source:"أكواد الاستعلام 2025"},
  {id:39,name:"ذي بنك اوف نوفا سكوشيا",code:"FB36000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:40,name:"البنك الوطني العماني",code:"FB37000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:41,name:"بنك المشرق",code:"FB38000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:42,name:"البنك العربي",code:"FB39000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:43,name:"بنك أبو ظبي الأول",code:"FB51000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:44,name:"ستي بنك ان ايه - مصر",code:"FB53000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:45,name:"البنك الأهلي اليوناني",code:"FB57000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:46,name:"البنك الأهلي الباكستاني",code:"FB64000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:47,name:"بنك صادرات ايران",code:"FB66000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:48,name:"بنك الشرق الأوسط المحدود",code:"FB69000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:49,name:"مصرف الرافدين",code:"FB73000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:50,name:"البنك السوداني المصري",code:"FB95380001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:51,name:"توماس كوك",code:"FB96000001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:52,name:"امريكان اكسبريس",code:"FB96010001",category:"بنك أجنبي",source:"أكواد الاستعلام 2025"},
  {id:53,name:"شركة تنمية / شركة سنده",code:"MF00010001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:54,name:"جمعية تنمية المجتمع بسوهاج",code:"MF00020000",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:55,name:"جمعية سيدات أعمال اسكندرية",code:"MF00020001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:56,name:"الجمعية المصرية للتنمية والتمويل",code:"MF00020002",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:57,name:"جمعية رجال الأعمال والمستثمرين الدقهلية",code:"MF00020003",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:58,name:"كاش",code:"MF00020011",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:59,name:"كاش قديم قبل بلتون",code:"MF00020012",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:60,name:"وسيلة (اور كابيتال)",code:"MF00020013",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:61,name:"جمعية سيدات أعمال ومستثمرين اسيوط",code:"MF00020156",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:62,name:"الشركة المصرية الوطنية (لييد)",code:"MF00021006",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:63,name:"المؤسسة المصرية",code:"MF00021007",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:64,name:"مؤسسة أنا المصري",code:"MF00021021",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:65,name:"شباب مصر",code:"MF00021028",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:66,name:"جمعية رجال الأعمال والمستثمرين بالشرقية",code:"MF00021029",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:67,name:"شركة ريديك",code:"MF00021030",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:68,name:"جمعية رجال الأعمال والمستثمرين اسيوط",code:"MF00021032",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:69,name:"الجمعية المصرية للتنمية الشاملة",code:"MF00021040",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:70,name:"سان مارك",code:"MF00021054",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:71,name:"جمعية تحفيظ القرآن الكريم",code:"MF00021057",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:72,name:"جمعية حواء",code:"MF00021076",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:73,name:"باب رزق",code:"MF00021114",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:74,name:"شركة BEST",code:"MF00021119",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:75,name:"جمعية رجال الأعمال نجع حمادي",code:"MF00021132",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:76,name:"جمعية الصم والبكم لذوي الاحتياجات الخاصة",code:"MF00021143",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:77,name:"الأولى",code:"MF00021174",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:78,name:"جمعية المحبة",code:"MF00021181",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:79,name:"جمعية رابطة المرأة بأسيوط",code:"MF00021188",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:80,name:"مؤسسة تنمية الأسرة المصرية",code:"MF00021206",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:81,name:"جمعية تنمية المجتمع ببا",code:"MF00021219",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:82,name:"جمعية بشاير الخير",code:"MF00021231",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:83,name:"مبادرة",code:"MF00021245",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:84,name:"جمعية سيدات الأعمال اسيوط (كود جديد)",code:"MF00021256",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:85,name:"جمعية المرأة الريفية",code:"MF00021259",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:86,name:"الشؤون الاجتماعية",code:"MF00021264",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:87,name:"المؤسسة المصرية للتنمية (جمعية محروسة بسوهاج)",code:"MF00021306",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:88,name:"جمعية تنمية القدرات بقنا",code:"MF00021359",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:89,name:"جمعية كاريتاس",code:"MF00021373",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:90,name:"الجمعية الإقليمية للتنمية والمشروعات",code:"MF00021375",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:91,name:"جمعية الصعيد",code:"MF00021420",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:92,name:"جمعية التنمية والطفولة",code:"MF00021424",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:93,name:"عمال المحاجر",code:"MF00021553",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:94,name:"جمعية خالد فضل",code:"MF00021815",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:95,name:"ريفي",code:"MF00030001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:96,name:"تساهيل",code:"MF00040001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:97,name:"مؤسسة التضامن",code:"MF00050001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:98,name:"جمعية تنمية المشروعات الصغيرة ببورسعيد",code:"MF00060001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:99,name:"الهيئة القبطية الإنجيلية",code:"MF00070001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:100,name:"مؤسسة مصر الخير",code:"MF00090001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:101,name:"شركة سنده للتمويل متناهي الصغر",code:"MF00100001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:102,name:"شركة أمان",code:"MF00110001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:103,name:"تمويلي",code:"MF00120001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:104,name:"شركة فوري",code:"MF00130001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:105,name:"فيتاس مصر",code:"MF00140001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:106,name:"جمعية صغار الصناع",code:"MF00160001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:107,name:"الأهلي تمكين",code:"MF00180001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:108,name:"شركة بدايتي",code:"MF00190001",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:109,name:"كاش للمبالغ الجديدة",code:"MF00200000",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:110,name:"ارادة",code:"MF00121007",category:"تمويل متناهي الصغر",source:"أكواد الاستعلام 2025"},
  {id:111,name:"الصندوق الاجتماعي للتنمية",code:"NB93000001",category:"هيئة ومؤسسة أخرى",source:"أكواد الاستعلام 2025"},
  {id:112,name:"المصرف العربي الدولي",code:"NB95400001",category:"هيئة ومؤسسة أخرى",source:"أكواد الاستعلام 2025"},
  {id:113,name:"بنك ناصر الاجتماعي",code:"NB95000001",category:"هيئة ومؤسسة أخرى",source:"أكواد الاستعلام 2025"},
  {id:114,name:"جهاز تنمية المشروعات المتوسطة",code:"NB00010001",category:"هيئة ومؤسسة أخرى",source:"أكواد الاستعلام 2025"},
  {id:115,name:"المصرف العربي الدولي",code:"NB94000001",category:"هيئة ومؤسسة أخرى",source:"أكواد الاستعلام 2025"},
  {id:116,name:"شركة تشارتر للاستشارات المالية",code:"FS00030001",category:"خدمات مالية غير مصرفية",source:"أكواد الاستعلام 2025"},
  {id:117,name:"شركة القاهرة التخصيم",code:"FS00040000",category:"خدمات مالية غير مصرفية",source:"أكواد الاستعلام 2025"},
  {id:118,name:"فاليو لخدمات البيع بالتقسيط",code:"FS00050001",category:"خدمات مالية غير مصرفية",source:"أكواد الاستعلام 2025"},
  {id:119,name:"شركة رأس المال المخاطر",code:"FS00060002",category:"خدمات مالية غير مصرفية",source:"أكواد الاستعلام 2025"},
  {id:120,name:"بريمور انترناشيونال لخدمات الائتمان",code:"CR00010001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:121,name:"مجموعة شركة هاباك",code:"RC00010001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:122,name:"الشركة العالمية المتحدة للتجارة",code:"RC00030001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:123,name:"الشركة الدولية للاستثمار والتجارة",code:"RC00040001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:124,name:"شركة يونيون جروب",code:"RC00050001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:125,name:"المجموعة المصرية للأنظمة الطبية",code:"RC00060001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:126,name:"شركة درايف",code:"RC00070001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:127,name:"شركة B-TECH",code:"RC00090001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:128,name:"شركة راية",code:"RC00110001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:129,name:"رواج لتجارة السيارات",code:"RC00120001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:130,name:"شركة عفراء لتكنولوجيا الحاسبات",code:"RC00130001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:131,name:"شركة مصر الحجاز لمواد التعبئة",code:"RC00140001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:132,name:"الشركة المصرية لأنظمة التغليف",code:"RC00150001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:133,name:"بروسوفت لنظم المعلومات",code:"RC00160001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:134,name:"شركة سكاي ايجيبت للتوريد",code:"RC00190001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:135,name:"شركة غليونجي للتجارة",code:"RC00200001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:136,name:"شركة سكاي فايناس لتقسيط السيارات",code:"RC00210001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:137,name:"كونتاكت",code:"RC00230001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:138,name:"تقسيط شركة فاليو",code:"RC00290001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:139,name:"أمان أجهزة وسلع معمرة",code:"RC00320001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:140,name:"فاينانشال تكنولوجيز",code:"RC00350001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:141,name:"سهولة",code:"RC00400001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:142,name:"مشروعي",code:"RC00460001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:143,name:"شركة حالا للبيع بالتقسيط",code:"RC00580001",category:"ائتمان واستهلاك",source:"أكواد الاستعلام 2025"},
  {id:144,name:"المصرية للتأمين التكافلي حياة",code:"IC00010001",category:"تأمين",source:"أكواد الاستعلام 2025"},
  {id:145,name:"الشركة الوطنية للغاز",code:"UC00010001",category:"مرافق",source:"أكواد الاستعلام 2025"},
  {id:146,name:"اورانج مصر للاتصالات",code:"UC00020001",category:"مرافق",source:"أكواد الاستعلام 2025"},
  {id:147,name:"التعمير للتمويل العقاري الأولى",code:"MG98000001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:148,name:"المصرية للتمويل العقاري",code:"MG98010001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:149,name:"تمويل للتمويل العقاري",code:"MG98020001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:150,name:"تمويل الإمارات للتمويل العقاري",code:"MG98040001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:151,name:"التيسير للتمويل العقاري",code:"MG98050001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:152,name:"شركة بيت للتمويل العقاري",code:"MG98060001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:153,name:"سكن للتمويل العقاري",code:"MG98070001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:154,name:"الأهلي المتحد للتمويل العقاري",code:"MG98080001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:155,name:"الأهلي للتمويل العقاري",code:"MG98090001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:156,name:"شركة المصريين للتمويل العقاري",code:"MG98100001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:157,name:"شركة كونتاكت للتمويل العقاري",code:"MG98120001",category:"تمويل عقاري",source:"أكواد الاستعلام 2025"},
  {id:158,name:"الشركة الدولية لتأجير التمويل",code:"LF98500001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:159,name:"شركة توشكى للتأجير العقاري",code:"LF98510001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:160,name:"شركة كوربلبيس للتأجير التمويلي",code:"LF98520001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:161,name:"شركة اوريكس مصر للتأجير التمويلي",code:"LF98530001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:162,name:"شركة التوفيق للتأجير التمويلي",code:"LF98540001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:163,name:"شركة أملاك للتمويل مصر",code:"LF98550001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:164,name:"شركة تكنوليس للتمويل التأجيري",code:"LF98560001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:165,name:"شركة بيربوس للتأجير التمويلي",code:"LF98570001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:166,name:"شركة المصريين للإنماء الاقتصادي",code:"LF98580001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:167,name:"شركة جي بي للتمويل التأجيري",code:"LF98590001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:168,name:"شركة بي ان بي باربيا للتأجير التمويلي",code:"LF98600001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:169,name:"شركة سوجيليس ايجيبت للتأجير التمويلي",code:"LF98610001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:170,name:"شركة اديليس للتأجير التمويلي",code:"LF98620001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:171,name:"شركة تمويل للتأجير التمويلي",code:"LF98630001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:172,name:"شركة جراند انفستمنت للتأجير التمويلي",code:"LF98640001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:173,name:"شركة ايماك للتأجير التمويلي",code:"LF98650001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:174,name:"شركة بيت الخبرة للتنمية الاقتصادية",code:"LF98660001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:175,name:"شركة الأهلي للتأجير التمويلي",code:"LF98670001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:176,name:"شركة بلس للتأجير التمويلي",code:"LF98680001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:177,name:"المجموعة المالية هيرميس للتأجير",code:"LF98700001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:178,name:"شركة العربي الأفريقي الدولي للتأجير",code:"LF98710001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:179,name:"جلوبال ليس للتأجير التمويلي",code:"LF98720001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:180,name:"التعمير للتأجير التمويلي الأولى",code:"LF98740001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:181,name:"شركة إنماء للتأجير التمويلي",code:"LF98750001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:182,name:"يونايتد للتأجير التمويلي",code:"LF98760001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:183,name:"شركة بي ام للتأجير التمويلي",code:"LF98770001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:184,name:"شركة تنمية للتأجير التمويلي",code:"LF98780001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:185,name:"شركة كايرو للتأجير التمويلي",code:"LF98800001",category:"تأجير تمويلي",source:"أكواد الاستعلام 2025"},
  {id:186,name:"شركة مدينة نصر للإسكان والتعمير",code:"HS00010001",category:"إسكان وتعمير",source:"أكواد الاستعلام 2025"},
  {id:187,name:"مجموعة عامر",code:"HS00020001",category:"إسكان وتعمير",source:"أكواد الاستعلام 2025"},
  {id:188,name:"شركة اوراسكوم للإسكان والتعمير",code:"HS00040001",category:"إسكان وتعمير",source:"أكواد الاستعلام 2025"},
  {id:189,name:"شركة بالم هيلز للتعمير",code:"HS00050001",category:"إسكان وتعمير",source:"أكواد الاستعلام 2025"},
  {id:190,name:"شركة ايه اي سي فايناس التجارية",code:"HS00060001",category:"إسكان وتعمير",source:"أكواد الاستعلام 2025"},
  {id:191,name:"مجموعة مطاوع جروب للاستثمار",code:"HS00070001",category:"إسكان وتعمير",source:"أكواد الاستعلام 2025"},
  {id:192,name:"الشركة الدولية للتنمية العقارية",code:"HS00080001",category:"إسكان وتعمير",source:"أكواد الاستعلام 2025"},
];

const CAT_META = {
  "بنك عام":               {ic:"🏛️",ac:"#1d6fdb"},
  "بنك متخصص":            {ic:"🏦",ac:"#7c3aed"},
  "بنك تجاري":             {ic:"🏦",ac:"#0891b2"},
  "بنك استثماري":          {ic:"💼",ac:"#059669"},
  "بنك أجنبي":             {ic:"🌐",ac:"#d97706"},
  "تمويل متناهي الصغر":   {ic:"🌱",ac:"#059669"},
  "هيئة ومؤسسة أخرى":     {ic:"🏢",ac:"#64748b"},
  "خدمات مالية غير مصرفية":{ic:"📊",ac:"#7c3aed"},
  "ائتمان واستهلاك":       {ic:"🛒",ac:"#dc2626"},
  "تأمين":                 {ic:"🛡️",ac:"#0891b2"},
  "مرافق":                 {ic:"⚡",ac:"#d97706"},
  "تمويل عقاري":           {ic:"🏠",ac:"#d97706"},
  "تأجير تمويلي":          {ic:"📋",ac:"#64748b"},
  "إسكان وتعمير":          {ic:"🏗️",ac:"#059669"},
  "مستورد من PDF":         {ic:"📄",ac:"#7c3aed"},
};

// ══ SAFE STORAGE (works even if localStorage is blocked in a WebView) ══
const mem = {};
const store = {
  get(k){ try{ return localStorage.getItem(k); }catch(e){ return mem[k] ?? null; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch(e){ mem[k]=v; } },
};

// ══ STATE ══
let DATA = [...BASE_DATA];
let activeFilter = 'all';
let currentResults = [];
let fuseInst = null;
let acTimer = null;
let currentView = 'search';
let favorites = new Set(JSON.parse(store.get('favIds') || '[]'));

// ══ THEME ══
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  store.set('theme', t);
}
(function initTheme(){
  const saved = store.get('theme');
  const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (preferDark ? 'dark' : 'light'));
})();
document.getElementById('btnTheme').onclick = () => {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
};

// ══ ARABIC NORMALIZE ══
function norm(s){
  if(!s) return '';
  return s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g,'')
    .replace(/[أإآاٱ]/g,'ا')
    .replace(/ة/g,'ه')
    .replace(/ى/g,'ي')
    .replace(/ؤ/g,'و')
    .replace(/ئ/g,'ي')
    .replace(/\s+/g,' ')
    .trim();
}

// ══ FUSE INIT ══
function buildFuse(){
  const pool = DATA.map(d=>({...d,_n:norm(d.name),_c:d.code.toLowerCase(),_cat:norm(d.category)}));
  fuseInst = new Fuse(pool,{
    keys:[{name:'_n',weight:.5},{name:'_c',weight:.3},{name:'_cat',weight:.1},{name:'name',weight:.1}],
    threshold:0.45,includeScore:true,minMatchCharLength:1,
  });
  document.getElementById('hTotal').textContent = DATA.length;
  document.getElementById('resTot').textContent = DATA.length;
  document.getElementById('infoTotal').textContent = DATA.length;
}

// ══ SEARCH ══
function doSearch(raw){
  raw = (raw||'').trim();
  if(!raw){ showWelcome(); return; }

  const q = norm(raw);
  const ql = raw.toLowerCase();

  let pool = activeFilter==='all' ? DATA : DATA.filter(d=>d.category===activeFilter);

  let res = pool.filter(d=>
    norm(d.name).includes(q) ||
    d.code.toLowerCase().includes(ql) ||
    norm(d.category).includes(q)
  );

  if(!res.length && fuseInst){
    const fp = new Fuse(
      pool.map(d=>({...d,_n:norm(d.name),_c:d.code.toLowerCase(),_cat:norm(d.category)})),
      {keys:['_n','_c','_cat'],threshold:0.5,includeScore:true}
    );
    res = fp.search(q).map(r=>r.item);
  }

  sortAndRender(res, raw);
}

function sortAndRender(res, q){
  const s = document.getElementById('sortSel').value;
  let r = [...res];
  if(s==='name') r.sort((a,b)=>a.name.localeCompare(b.name,'ar'));
  else if(s==='code') r.sort((a,b)=>a.code.localeCompare(b.code));
  else if(s==='cat') r.sort((a,b)=>a.category.localeCompare(b.category,'ar'));
  currentResults = r;
  renderCards(r, q, document.getElementById('cardsGrid'));
  document.getElementById('resNum').textContent = r.length;
  const head = document.getElementById('resHead');
  const empty = document.getElementById('emptyState');
  document.getElementById('welcomeState').style.display='none';
  if(!r.length){ empty.classList.add('show'); head.classList.remove('show'); }
  else { empty.classList.remove('show'); head.classList.add('show'); }
}

// ══ RENDER (shared by search results & favorites) ══
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function hl(txt,q){
  if(!q) return esc(txt);
  const nq=norm(q), nt=norm(txt);
  const i=nt.indexOf(nq); if(i<0) return esc(txt);
  return esc(txt.slice(0,i))+'<mark>'+esc(txt.slice(i,i+nq.length))+'</mark>'+esc(txt.slice(i+nq.length));
}
function hlCode(code,q){
  if(!q) return esc(code);
  const i=code.toLowerCase().indexOf(q.toLowerCase()); if(i<0) return esc(code);
  return esc(code.slice(0,i))+'<mark>'+esc(code.slice(i,i+q.length))+'</mark>'+esc(code.slice(i+q.length));
}

const starIcon = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1L12 2Z"/></svg>`;
const copyIcon = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const docIcon = `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>`;

function renderCards(res, q, grid){
  grid.innerHTML='';
  res.forEach((item,i)=>{
    const m = CAT_META[item.category]||{ic:'🏢',ac:'#1d6fdb'};
    const isFav = favorites.has(item.id);
    const card = document.createElement('div');
    card.className='card';
    card.style.cssText=`--card-ac:${m.ac};animation-delay:${Math.min(i*25,250)}ms`;
    const tagBg = m.ac+'18';
    card.innerHTML=`
      <div class="card-top">
        <div class="card-name">${hl(item.name,q)}</div>
        <button class="btn-star ${isFav?'on':''}" data-id="${item.id}" title="إضافة للمفضلة" aria-label="إضافة للمفضلة">${starIcon}</button>
      </div>
      <div class="card-tag" style="color:${m.ac};background:${tagBg};border-color:${m.ac}35">${item.category}</div>
      <div class="code-block">
        <span class="code-lbl">كود الاستعلام</span>
        <span class="code-val">${hlCode(item.code,q)}</span>
      </div>
      <div class="card-btns">
        <button class="btn-c" data-act="code" data-code="${esc(item.code)}">${copyIcon} نسخ الكود</button>
        <button class="btn-c" data-act="full" data-id="${item.id}">${docIcon} نسخ البيانات</button>
      </div>`;
    grid.appendChild(card);
  });
}

// event delegation for card buttons (works for both grids)
document.addEventListener('click', e=>{
  const star = e.target.closest('.btn-star');
  if(star){ toggleFavorite(parseInt(star.dataset.id), star); return; }
  const btn = e.target.closest('.btn-c');
  if(btn){
    if(btn.dataset.act==='code') cpCode(btn.dataset.code, btn);
    else if(btn.dataset.act==='full') cpFull(parseInt(btn.dataset.id), btn);
  }
});

// ══ FAVORITES ══
function toggleFavorite(id, btn){
  if(favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  store.set('favIds', JSON.stringify([...favorites]));
  if(btn) btn.classList.toggle('on');
  updateFavBadge();
  if(currentView==='favorites') renderFavorites();
}
function updateFavBadge(){
  const badge = document.getElementById('favBadge');
  const n = favorites.size;
  badge.textContent = n;
  badge.hidden = n===0;
}
function renderFavorites(){
  const items = DATA.filter(d=>favorites.has(d.id));
  const grid = document.getElementById('favGrid');
  const empty = document.getElementById('favEmpty');
  renderCards(items, '', grid);
  empty.classList.toggle('show', items.length===0);
}
document.getElementById('btnClearFav').onclick = ()=>{
  favorites.clear();
  store.set('favIds','[]');
  updateFavBadge();
  renderFavorites();
  toast('تم مسح كل المفضلة');
};

// ══ WELCOME ══
function showWelcome(){
  document.getElementById('cardsGrid').innerHTML='';
  document.getElementById('emptyState').classList.remove('show');
  document.getElementById('resHead').classList.remove('show');
  const wel = document.getElementById('welcomeState');
  wel.style.display='block';
  const g = document.getElementById('welcomeGrid');
  g.innerHTML='';
  const cats={};
  DATA.forEach(d=>{ cats[d.category]=(cats[d.category]||0)+1; });
  Object.entries(cats).forEach(([c,cnt])=>{
    const m=CAT_META[c]||{ic:'🏢',ac:'#1d6fdb'};
    const div=document.createElement('div');
    div.className='w-card';
    div.style.borderColor=m.ac+'35';
    div.innerHTML=`<div class="w-name">${esc(c)}</div><div class="w-cnt">${cnt} مؤسسة</div>`;
    div.onclick=()=>{ setFilter(c); showFilterResults(c); };
    g.appendChild(div);
  });
}

function showFilterResults(cat){
  const pool = DATA.filter(d=>d.category===cat);
  sortAndRender(pool, '');
  document.getElementById('welcomeState').style.display='none';
}

// ══ FILTER ══
function setFilter(f){
  activeFilter=f;
  document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('on',c.dataset.f===f));
}

// ══ AUTOCOMPLETE ══
function showAC(q){
  const drop=document.getElementById('acDrop');
  if(!q||q.length<1){drop.classList.remove('open');return;}
  const nq=norm(q);
  const hits=DATA.filter(d=>norm(d.name).includes(nq)||d.code.toLowerCase().includes(q.toLowerCase())).slice(0,6);
  if(!hits.length){drop.classList.remove('open');return;}
  drop.innerHTML=hits.map(d=>`
    <div class="ac-item" data-id="${d.id}">
      <span class="ac-name">${esc(d.name)}</span>
      <span class="ac-code">${esc(d.code)}</span>
      <span class="ac-cat">${esc(d.category)}</span>
    </div>`).join('');
  drop.classList.add('open');
}
document.getElementById('acDrop').addEventListener('click', e=>{
  const item = e.target.closest('.ac-item');
  if(!item) return;
  pickAC(parseInt(item.dataset.id));
});

function pickAC(id){
  const d=DATA.find(x=>x.id===id); if(!d) return;
  document.getElementById('searchInput').value=d.name;
  document.getElementById('acDrop').classList.remove('open');
  updateClear();
  doSearch(d.name);
}

// ══ COPY ══
function cpCode(code,btn){
  const done=()=>{
    btn.classList.add('done');btn.textContent='✓ تم النسخ';
    toast('تم نسخ الكود: '+code);
    setTimeout(()=>{btn.classList.remove('done');btn.innerHTML=copyIcon+' نسخ الكود';},2000);
  };
  if(navigator.clipboard){ navigator.clipboard.writeText(code).then(done).catch(()=>fallbackCopy(code,done)); }
  else fallbackCopy(code,done);
}
function cpFull(id,btn){
  const d=DATA.find(x=>x.id===id); if(!d) return;
  const t=`الاسم: ${d.name}\nالكود: ${d.code}\nالتصنيف: ${d.category}\nالمصدر: ${d.source}`;
  const done=()=>{
    btn.classList.add('done');btn.textContent='✓ تم النسخ';
    toast('تم نسخ البيانات الكاملة');
    setTimeout(()=>{btn.classList.remove('done');btn.innerHTML=docIcon+' نسخ البيانات';},2000);
  };
  if(navigator.clipboard){ navigator.clipboard.writeText(t).then(done).catch(()=>fallbackCopy(t,done)); }
  else fallbackCopy(t,done);
}
function fallbackCopy(text,cb){
  const ta=document.createElement('textarea');
  ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
  document.body.appendChild(ta);ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  document.body.removeChild(ta);
  cb();
}

// ══ TOAST ══
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('on');
  setTimeout(()=>t.classList.remove('on'),2500);
}

// ══ EXPORT CSV ══
document.getElementById('btnExp').onclick=()=>{
  if(!currentResults.length){ toast('لا توجد نتائج للتصدير'); return; }
  const BOM='\uFEFF';
  const rows=currentResults.map(r=>`"${r.name}","${r.code}","${r.category}","${r.source}"`);
  const csv=BOM+'الاسم,الكود,التصنيف,المصدر\n'+rows.join('\n');
  try{
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    a.download='اكواد_الاستعلام_الائتماني.csv';
    a.click();
    toast('تم تصدير '+currentResults.length+' نتيجة');
  }catch(e){
    fallbackCopy(csv, ()=>toast('تم نسخ البيانات كنص (تعذر التنزيل المباشر)'));
  }
};

// ══ SORT ══
document.getElementById('sortSel').onchange=()=>{
  const q=document.getElementById('searchInput').value;
  if(currentResults.length) sortAndRender(currentResults,q);
};

// ══ FILTER CHIPS ══
document.getElementById('filterChips').onclick=e=>{
  const c=e.target.closest('.chip'); if(!c) return;
  setFilter(c.dataset.f);
  const q=document.getElementById('searchInput').value;
  if(q.trim()) doSearch(q);
  else if(activeFilter!=='all'){
    showFilterResults(activeFilter);
  } else showWelcome();
};

// ══ INPUT EVENTS ══
const inp=document.getElementById('searchInput');

function updateClear(){
  document.getElementById('btnClear').classList.toggle('show',inp.value.trim().length>0);
}

inp.addEventListener('input',()=>{
  updateClear();
  clearTimeout(acTimer);
  acTimer=setTimeout(()=>{
    showAC(inp.value);
    if(inp.value.trim().length>=1) doSearch(inp.value);
    else { document.getElementById('acDrop').classList.remove('open'); showWelcome(); }
  },100);
});

inp.addEventListener('keydown',e=>{
  if(e.key==='Enter'){ document.getElementById('acDrop').classList.remove('open'); doSearch(inp.value); inp.blur(); }
  if(e.key==='Escape') document.getElementById('acDrop').classList.remove('open');
});

document.getElementById('btnClear').onclick=()=>{
  inp.value='';updateClear();
  document.getElementById('acDrop').classList.remove('open');
  showWelcome();inp.focus();
};

document.addEventListener('click',e=>{
  if(!e.target.closest('.search-wrap'))
    document.getElementById('acDrop').classList.remove('open');
});

// ══ BOTTOM NAV / VIEWS ══
function switchView(view){
  currentView = view;
  document.querySelectorAll('.view').forEach(v=>{ v.hidden = v.dataset.view !== view; });
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('on', b.dataset.view===view));
  if(view==='favorites') renderFavorites();
  window.scrollTo({top:0,behavior:'instant'});
}
document.getElementById('bottomNav').addEventListener('click', e=>{
  const btn = e.target.closest('.nav-btn'); if(!btn) return;
  switchView(btn.dataset.view);
});

// ══ OFFLINE BANNER ══
function updateOnlineStatus(){
  document.getElementById('offlineBar').classList.toggle('show', !navigator.onLine);
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// ══ INSTALL PROMPT (Android/Chrome — helps before APK wrapping too) ══
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('btnInstall').hidden = false;
});
document.getElementById('btnInstall').onclick = async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('btnInstall').hidden = true;
};

// ══ SERVICE WORKER (offline support) ══
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{/* ignore in unsupported hosts */});
  });
}

// ══ INIT ══
buildFuse();
showWelcome();
updateFavBadge();
updateOnlineStatus();
