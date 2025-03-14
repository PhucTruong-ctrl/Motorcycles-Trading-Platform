export const motorcycleData = {
  BMW: {
    naked: [
      { model: "R1250R", trims: ["Standard", "Exclusive", "HP"] },
      {
        model: "R nineT",
        trims: ["Standard", "Pure", "Scrambler", "Urban G/S", "Racer"],
      },
      { model: "S1000R", trims: ["Standard", "Sport", "M Package"] },
      { model: "F900R", trims: ["Base", "Sport"] },
    ],
    cruiser: [
      {
        model: "R18",
        trims: [
          "Standard",
          "First Edition",
          "Classic",
          "B",
          "Transcontinental",
        ],
      },
      { model: "K1600B", trims: ["Standard", "Grand America"] },
    ],
    touring: [
      { model: "R1250RT", trims: ["Standard", "Exclusive", "HP"] },
      { model: "K1600GT", trims: ["Standard", "Grand America"] },
      { model: "K1600GTL", trims: ["Standard", "Exclusive"] },
      { model: "K1600 Grand America", trims: ["Standard"] },
    ],
    sport: [
      { model: "S1000RR", trims: ["Standard", "Pro", "M Package"] },
      { model: "M1000RR", trims: ["Standard", "Carbon Package"] },
    ],
    offroad: [
      { model: "F850GS", trims: ["Standard", "Adventure"] },
      { model: "F750GS", trims: ["Standard"] },
      { model: "G310GS", trims: ["Standard"] },
    ],
    adventure: [
      { model: "R1250GS", trims: ["Standard", "Adventure", "HP"] },
      { model: "R1250GS Adventure", trims: ["Standard", "Adventure", "HP"] },
      { model: "F850GS Adventure", trims: ["Standard", "Adventure"] },
      { model: "F900GS Adventure", trims: ["Base", "Sport"] },
    ],
    sportTouring: [
      { model: "R1250RS", trims: ["Standard", "Exclusive", "HP"] },
      { model: "K1600GT", trims: ["Standard", "Grand America"] },
      { model: "K1600GTL", trims: ["Standard", "Exclusive"] },
    ],
    scooters: [
      { model: "C400X", trims: ["Standard"] },
      { model: "C400GT", trims: ["Standard"] },
      { model: "CE04", trims: ["Standard"] },
    ],
    underbones: [
      { model: "G310R", trims: ["Standard"] },
      { model: "G310GS", trims: ["Standard"] },
      { model: "G310RR", trims: ["Standard"] },
    ],
  },
  Ducati: {
    naked: [
      {
        model: "Monster",
        trims: [
          "Standard",
          "Monster+",
          "Monster 821",
          "Monster 821 Stealth",
          "Monster 1200",
          "Monster 1200 S",
        ],
      },
    ],
    sport: [
      { model: "Panigale V2", trims: ["Standard"] },
      {
        model: "Panigale V4",
        trims: ["Standard", "V4 S", "V4 SP", "V4 R", "Superleggera V4"],
      },
    ],
    cruiser: [
      { model: "Diavel 1260", trims: ["Standard", "S", "Lamborghini"] },
      { model: "XDiavel", trims: ["Standard", "S", "Black Star"] },
    ],
    touring: [
      { model: "Multistrada 950", trims: ["Standard", "S"] },
      { model: "Multistrada V4", trims: ["Standard", "S", "S Sport"] },
      { model: "Multistrada 1260 Enduro", trims: ["Standard"] },
    ],
    adventure: [{ model: "Hypermotard 950", trims: ["Standard", "SP", "RVE"] }],
    sportTouring: [{ model: "SuperSport", trims: ["Standard", "S"] }],
  },
  Kawasaki: {
    naked: [
      { model: "Z1000", trims: ["Standard", "Special Edition"] },
      { model: "Z900", trims: ["Standard", "Performance"] },
      { model: "Z650", trims: ["Standard", "Performance"] },
      { model: "Z400", trims: ["Standard"] },
    ],
    cruiser: [
      { model: "Vulcan S", trims: ["Standard", "Cafe", "Custom"] },
      { model: "Vulcan 900 Classic", trims: ["Standard", "LT"] },
      { model: "Vulcan 1700 Voyager", trims: ["Standard", "ABS"] },
    ],
    touring: [{ model: "Concourse 14", trims: ["Standard", "ABS"] }],
    sport: [
      { model: "Ninja ZX-10R", trims: ["Standard", "SE", "KRT Edition"] },
      { model: "Ninja ZX-6R", trims: ["Standard", "636"] },
      { model: "Ninja 400", trims: ["Standard", "KRT Edition"] },
    ],
    offroad: [
      { model: "KLX250", trims: ["Standard", "Camo"] },
      { model: "KLX140", trims: ["Standard", "L", "G"] },
    ],
    adventure: [
      { model: "Versys 1000", trims: ["Standard", "LT"] },
      { model: "Versys 650", trims: ["Standard", "LT"] },
    ],
    sport_touring: [{ model: "Ninja H2 SX", trims: ["Standard", "SE"] }],
    scooters: [
      { model: "J300", trims: ["Standard"] },
      { model: "Z125 Pro", trims: ["Standard"] },
    ],
    underbones: [{ model: "KSR Pro", trims: ["Standard"] }],
  },
  Honda: {
    naked: [
      { model: "CB500F", trims: ["Standard", "ABS"] },
      { model: "CB650R", trims: ["Standard", "ABS"] },
      { model: "CB1000R", trims: ["Standard", "ABS"] },
      { model: "CBR500R", trims: ["Standard", "ABS"] },
      { model: "CBR650R", trims: ["Standard", "ABS"] },
      { model: "CBR1000RR", trims: ["Standard", "SP", "SP2"] },
      { model: "CBR1000RR-R", trims: ["Standard", "SP"] },
    ],
    cruiser: [
      { model: "Rebel 500", trims: ["Standard", "ABS"] },
      { model: "Rebel 1100", trims: ["Standard", "DCT", "ABS", "DCT+ABS"] },
      { model: "Shadow Phantom", trims: ["Standard"] },
      {
        model: "Gold Wing",
        trims: ["Standard", "Tour", "Tour DCT", "Tour ABS", "Tour DCT+ABS"],
      },
    ],
    touring: [
      {
        model: "Gold Wing",
        trims: ["Standard", "Tour", "Tour DCT", "Tour ABS", "Tour DCT+ABS"],
      },
      { model: "CTX700", trims: ["Standard", "DCT", "ABS", "DCT+ABS"] },
      { model: "CTX1300", trims: ["Standard", "ABS"] },
      { model: "NM4 Vultus", trims: ["Standard"] },
    ],
    sport: [
      { model: "CBR500R", trims: ["Standard", "ABS"] },
      { model: "CBR650R", trims: ["Standard", "ABS"] },
      { model: "CBR1000RR", trims: ["Standard", "SP", "SP2"] },
      { model: "CBR1000RR-R", trims: ["Standard", "SP"] },
    ],
    offroad: [
      { model: "CRF250F", trims: ["Standard"] },
      { model: "CRF450F", trims: ["Standard"] },
      { model: "CRF250L", trims: ["Standard", "Rally"] },
      { model: "CRF450L", trims: ["Standard"] },
      { model: "CRF300L", trims: ["Standard", "Rally"] },
      { model: "CRF450RX", trims: ["Standard"] },
      { model: "CRF450X", trims: ["Standard"] },
    ],
    adventure: [
      {
        model: "Africa Twin",
        trims: ["Standard", "DCT", "Adventure Sports", "Adventure Sports DCT"],
      },
      {
        model: "Africa Twin 1100",
        trims: ["Standard", "DCT", "Adventure Sports", "Adventure Sports DCT"],
      },
      { model: "NC750X", trims: ["Standard", "DCT"] },
      { model: "X-ADV", trims: ["Standard"] },
    ],
    sportTouring: [
      { model: "VFR800F", trims: ["Standard", "ABS"] },
      { model: "VFR1200F", trims: ["Standard", "DCT", "ABS"] },
      { model: "ST1300", trims: ["Standard", "ABS"] },
      { model: "NT1100", trims: ["Standard", "DCT"] },
    ],
    scooters: [
      { model: "PCX160", trims: ["Standard"] },
      { model: "Forza 300", trims: ["Standard"] },
      { model: "SH125i", trims: ["Standard"] },
      { model: "SH150i", trims: ["Standard"] },
      { model: "Dio", trims: ["Standard"] },
      { model: "Lead 125", trims: ["Standard"] },
      { model: "Vision 110", trims: ["Standard"] },
    ],
    underbones: [
      { model: "Wave 110i", trims: ["Standard"] },
      { model: "Future 125", trims: ["Standard"] },
      { model: "Blade 110", trims: ["Standard"] },
      { model: "C125 Super Cub", trims: ["Standard"] },
    ],
  },
  Yamaha: {
    naked: [
      { model: "MT-125", trims: ["Standard", "ABS"] },
      { model: "MT-15", trims: ["Standard", "ABS"] },
      { model: "MT-25", trims: ["Standard", "ABS"] },
      { model: "MT-03", trims: ["Standard", "ABS"] },
      { model: "MT-07", trims: ["Standard", "ABS"] },
      { model: "MT-09", trims: ["Standard", "ABS"] },
      { model: "MT-10", trims: ["Standard", "ABS"] },
    ],
    cruiser: [
      { model: "V-Star 250", trims: ["Standard"] },
      { model: "V-Star 650", trims: ["Classic", "Custom", "Silverado"] },
      { model: "V-Star 950", trims: ["Tourer", "Custom"] },
      { model: "V-Star 1300", trims: ["Tourer", "Deluxe"] },
      { model: "Bolt", trims: ["R-Spec", "C-Spec"] },
      { model: "Raider", trims: ["Standard"] },
      { model: "Warrior", trims: ["Midnight", "Standard"] },
      { model: "V-Max", trims: ["Standard"] },
    ],
    touring: [
      { model: "FJR1300", trims: ["Standard", "AE", "ES"] },
      { model: "Tracer 900", trims: ["Standard", "GT"] },
      { model: "Tracer 700", trims: ["Standard", "GT"] },
    ],
    sport: [
      { model: "YZF-R15", trims: ["Standard", "ABS"] },
      { model: "YZF-R3", trims: ["Standard", "ABS"] },
      { model: "YZF-R6", trims: ["Standard", "ABS"] },
      { model: "YZF-R1", trims: ["Standard", "M"] },
      { model: "YZF-R1M", trims: ["Standard"] },
    ],
    offroad: [
      { model: "WR250F", trims: ["Standard"] },
      { model: "WR450F", trims: ["Standard"] },
      { model: "YZ250F", trims: ["Standard"] },
      { model: "YZ450F", trims: ["Standard"] },
      { model: "XT250", trims: ["Standard"] },
      { model: "XT600", trims: ["Standard"] },
      { model: "XT1200Z Super Ténéré", trims: ["Standard"] },
    ],
    adventure: [
      { model: "XT660Z Ténéré", trims: ["Standard"] },
      { model: "XT1200Z Super Ténéré", trims: ["Standard"] },
    ],
    sportTouring: [
      { model: "FJR1300", trims: ["Standard", "AE", "ES"] },
      { model: "Tracer 900", trims: ["Standard", "GT"] },
      { model: "Tracer 700", trims: ["Standard", "GT"] },
    ],
    scooters: [
      { model: "NMAX 155", trims: ["Standard"] },
      { model: "YZF-R125", trims: ["Standard", "ABS"] },
      { model: "XMAX 300", trims: ["Standard"] },
      { model: "TMAX", trims: ["Standard"] },
    ],
    underbones: [
      { model: "YBR125", trims: ["Standard"] },
      { model: "YBR125 Cruiser", trims: ["Standard"] },
      { model: "YBR125 Custom", trims: ["Standard"] },
      { model: "YBR125 Diversion", trims: ["Standard"] },
      { model: "YBR150", trims: ["Standard"] },
      { model: "YBR250", trims: ["Standard"] },
      { model: "YS125", trims: ["Standard"] },
      { model: "YS150", trims: ["Standard"] },
      { model: "YS250", trims: ["Standard"] },
      { model: "YS250 Fazer", trims: ["Standard"] },
      { model: "YS300", trims: ["Standard"] },
      { model: "YS300 Fazer", trims: ["Standard"] },
      { model: "YSZ125", trims: ["Standard"] },
    ],
  },
  CFMOTO: {
    naked: [
      { model: "700CL-X", trims: ["Heritage", "Sport"] },
      { model: "800NK", trims: ["Standard"] },
    ],
    sport: [
      { model: "675SR", trims: ["Standard", "R"] },
      { model: "675NK", trims: ["Standard"] },
      { model: "500SR", trims: ["Standard"] },
    ],
    adventure: [
      { model: "450MT", trims: ["Standard"] },
      { model: "800MT", trims: ["Standard", "Touring"] },
      { model: "1250TR-G", trims: ["Standard"] },
    ],
    touring: [
      { model: "700CL-X Touring", trims: ["Standard"] },
      { model: "800MT Touring", trims: ["Standard"] },
    ],
    cruiser: [{ model: "CFMOTO Papio 125 XO2", trims: ["Standard"] }],
  },
  Aprilla: {
    naked: [
      { model: "Tuono 660", trims: ["Standard"] },
      { model: "Tuono V4 1100", trims: ["Standard"] },
    ],
    sport: [
      { model: "RS 660", trims: ["Standard"] },
      { model: "RSV4 1100", trims: ["Standard"] },
    ],
    adventure: [{ model: "Tuareg 660", trims: ["Standard"] }],
    touring: [
      { model: "SR GT 200", trims: ["Standard"] },
      { model: "SR GT 200 Sport", trims: ["Sport"] },
    ],
    scooters: [{ model: "SRV 850", trims: ["Standard"] }],
    underbones: [
      { model: "RX 125", trims: ["Standard"] },
      { model: "SX 125", trims: ["Standard"] },
    ],
  },
  Suzuki: {
    naked: [
      { model: "GSX-S1000", trims: ["Standard", "ABS", "Z"] },
      { model: "GSX-S750", trims: ["Standard", "ABS"] },
      { model: "SV650", trims: ["Standard", "ABS"] },
      { model: "V-Strom 650", trims: ["Standard", "XT"] },
      { model: "V-Strom 1000", trims: ["Standard", "XT"] },
      { model: "GSX150 Bandit", trims: ["Standard"] },
    ],
    cruiser: [
      { model: "Boulevard M109R", trims: ["Standard", "C90T"] },
      { model: "Boulevard C50", trims: ["Standard", "C50T"] },
      { model: "Boulevard S40", trims: ["Standard"] },
      { model: "Intruder M1800R", trims: ["Standard"] },
    ],
    touring: [
      { model: "V-Strom 1000", trims: ["Standard", "XT"] },
      { model: "V-Strom 650", trims: ["Standard", "XT"] },
    ],
    sport: [
      { model: "GSX-R1000", trims: ["Standard", "R", "MotoGP Edition"] },
      { model: "GSX-R750", trims: ["Standard", "MotoGP Edition"] },
      { model: "GSX-R600", trims: ["Standard", "MotoGP Edition"] },
      { model: "GSX-R125", trims: ["Standard"] },
      { model: "GSX-R150", trims: ["Standard"] },
      { model: "GSX-S1000F", trims: ["Standard", "ABS"] },
    ],
    offroad: [
      { model: "RM-Z450", trims: ["Standard"] },
      { model: "RM-Z250", trims: ["Standard"] },
      { model: "RM85", trims: ["Standard"] },
    ],
    adventure: [
      { model: "V-Strom 1000", trims: ["Standard", "XT"] },
      { model: "V-Strom 650", trims: ["Standard", "XT"] },
    ],
    sport_touring: [
      { model: "GSX1250FA", trims: ["Standard"] },
      { model: "GSX1250F", trims: ["Standard"] },
    ],
    scooters: [
      { model: "Burgman 650", trims: ["Standard"] },
      { model: "Burgman 400", trims: ["Standard"] },
      { model: "Burgman 200", trims: ["Standard"] },
      { model: "Address 110", trims: ["Standard"] },
      { model: "Let's", trims: ["Standard"] },
    ],
    underbones: [
      { model: "Raider 150", trims: ["Standard", "Fi"] },
      { model: "Satria F150", trims: ["Standard", "Fi"] },
      { model: "Shogun 125", trims: ["Standard"] },
      { model: "Smash 110", trims: ["Standard"] },
    ],
  },
};
