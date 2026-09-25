import { createServerFn } from "@tanstack/react-start";
import { getSupabaseAdmin } from "./supabaseAdmin";
import { requireCouncillorProfile, validateAccessToken } from "./councillorAuth";

export interface Municipality {
  id: string;
  name: string;
  abbreviation: string;
  connected: boolean;
}

// The 8 metros plus the largest local municipality, per Thami's spec. Only
// "coj" has any real ward/councillor data behind it — see
// WARDS_BY_MUNICIPALITY below. "connected" here is informational only
// (used for the left-panel list); the actual "do we have real data" gate
// is always the ward list being non-empty, since a municipality could one
// day have some real wards and some not.
export const TOP_MUNICIPALITIES: Municipality[] = [
  { id: "coj", name: "City of Johannesburg", abbreviation: "CoJ", connected: true },
  { id: "coct", name: "City of Cape Town", abbreviation: "CoCT", connected: true },
  { id: "ethekwini", name: "eThekwini Metropolitan Municipality (Durban)", abbreviation: "eThekwini", connected: false },
  { id: "tshwane", name: "City of Tshwane (Pretoria)", abbreviation: "CoT", connected: false },
  { id: "ekurhuleni", name: "Ekurhuleni Metropolitan Municipality (East Rand)", abbreviation: "EMM", connected: false },
  { id: "nelson-mandela-bay", name: "Nelson Mandela Bay Metropolitan Municipality (Gqeberha)", abbreviation: "NMBM", connected: false },
  { id: "buffalo-city", name: "Buffalo City Metropolitan Municipality (East London)", abbreviation: "BCMM", connected: false },
  { id: "mangaung", name: "Mangaung Metropolitan Municipality (Bloemfontein)", abbreviation: "MMM", connected: false },
  { id: "msunduzi", name: "Msunduzi Local Municipality (Pietermaritzburg)", abbreviation: "Msunduzi", connected: false },
];

export interface WardListing {
  wardNumber: string;
  municipalityId: string;
  regionName: string;
  councillorName: string | null;
  approved: boolean;
  residentEstimate: string | null;
}

const COCT_WARDS: WardListing[] = [
    { wardNumber: "1", municipalityId: "coct", regionName: "Baronetcy Estate / De Duin / De Grendel Farm / Kaapzicht (+10 more)", councillorName: "Cheryl Visser", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "coct", regionName: "Belvedere Tygerberg / Bosbell / Boston / Churchill Estate (+8 more)", councillorName: "Roger Cannon", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "coct", regionName: "Bellair / Blommendal / Blomtuin / Chrismar (+12 more)", councillorName: "Annelize Van Zyl", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "coct", regionName: "Joe Slovo Park / Milnerton Ridge / Montague Gardens / Phoenix (+3 more)", councillorName: "Anthony Benadie", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "coct", regionName: "Annandale Farm / Atlas Gardens Business Park / Bothasig / Burgundy Estate (+7 more)", councillorName: "Miquette Temlett", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "coct", regionName: "Belmont Park / Botfontein Smallholdings / Wallacedene / Thakudi Street (+1 more)", councillorName: "Siviwe Nodliwa", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "coct", regionName: "Botfontein Smallholdings / Bottelary Smallholdings / Brackenfell South / Stonewood Street (+7 more)", councillorName: "Gabriel Twigg", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "coct", regionName: "Annandale / Brackenfell Central / Brackenfell Common / Brackenfell South (+16 more)", councillorName: "Johann Loots", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "coct", regionName: "Bellville Landfill / Bellville South / Bellville South Industrial / CPUT (+9 more)", councillorName: "Mercia Kleinsmith", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "coct", regionName: "Avondale / Beaconvale / Belgravia / Bellrail (+23 more)", councillorName: "Jacoline Visser", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "coct", regionName: "Amandelrug / Amandelsig / Bellville Teachers College / Benno Park (+25 more)", councillorName: "Pieter  de Vos", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "coct", regionName: "Belhar Ext 10 / Belhar Ext 11 / Belhar Ext 12 / Belhar Ext 13 (+14 more)", councillorName: "Willie  Jaftha", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "coct", regionName: "Delft 1 & 2 / Delft 3 / Delft 4 / Delft 5 (+3 more)", councillorName: "Michelle Adonis", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "coct", regionName: "Aan De Wijmlanden Estate / Austinville / Blackheath Industria / Blue Owns Cbd (+25 more)", councillorName: "Kariena Mare", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "coct", regionName: "Bel'Aire / Braeview / Briza / Die Wingerd (+18 more)", councillorName: "Gregory Peck", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "coct", regionName: "Dreamworld / Driftsands / Eersterivier South / Eersterivier (+2 more)", councillorName: "Ursula Barends", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "coct", regionName: "Dennemere / Forest Heights / Hillcrest Heights / Kleinvlei Town (+5 more)", councillorName: "Frans Sauls", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "coct", regionName: "Mxolisi Phetani / Thembokwezi", councillorName: "Ntomboxolo Kopman", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "coct", regionName: "Camelot / Hagley / Highbury / Highbury Park (+8 more)", councillorName: "Ebrahim Sawant", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "coct", regionName: "Leiden / Usutu Pos And Homtini Street / Voorbrug", councillorName: "Dineo Masiu", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "coct", regionName: "Amanda Glen / Bethanie / Bloemhof / Bo Oakdale (+20 more)", councillorName: "Hendri Terblanche", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "coct", regionName: "Belhar Ext 1 / Belhar Ext 17 / Belhar Ext 2 / Belhar Ext 3 (+12 more)", councillorName: "Johanna Martlow", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "coct", regionName: "Big Bay / Blaauwbergstrand / Cape Farms / District B (+8 more)", councillorName: "Paul Swart", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "coct", regionName: "Cape Town Airport / Delft South / Basboom Road / Welwitschia Crescent (+1 more)", councillorName: "Phumla  Tause", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "coct", regionName: "Connaught / Cravenby / Eureka Estate / Florida (+2 more)", councillorName: "Beverley van Reenen", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "coct", regionName: "Avon / Beaconvale / Elsies River Industria / Leonsdale (+8 more)", councillorName: "Franchesca Walker", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "coct", regionName: "Glenwood / Goodwood Estate / Goodwood Ext 1 / Montague (+5 more)", councillorName: "Cecile Janse van Rensburg", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "coct", regionName: "Area not yet listed", councillorName: "Christopher Jordaan", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "coct", regionName: "Atlantis Industrial / Avondale / Westfleur / Cape Farms (+9 more)", councillorName: "Allister Lightburn", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "coct", regionName: "Manenberg / Hex Crescent / Tousberg Road / Duinefontein Road (+5 more)", councillorName: "Deidree De Vos", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "coct", regionName: "Bishop Lavis / Bonteheuwel / Sandalwood Street And Smalblaar Road / Boquinar Industrial Area (+6 more)", councillorName: "Theresa Thompson", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "coct", regionName: "Atlantis Industrial / Avondale / Beacon Hill / Protea Park (+7 more)", councillorName: "Moosa Raise", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "coct", regionName: "Aan De Wijmlanden Estate", councillorName: "Lungisa Somdaka", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "coct", regionName: "Philippi / Ngcisininde Crescent / Govan Mbeki Road / Mildred Holo Street (+1 more)", councillorName: "Melikhaya Gadeni", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "coct", regionName: "Philippi / Kabodi Street / Ngcisininde Crescent / Bristol Road (+4 more)", councillorName: "Mboniswa Chitha", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "coct", regionName: "Crossroads / Philippi", councillorName: "Nceba Ntshweza", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "coct", regionName: "Crossroads / Nyanga / Ntlangano Crescent And Terminus Road", councillorName: "Lionel Martin", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "coct", regionName: "Crossroads", councillorName: "Suzanne Zumana", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "coct", regionName: "Area not yet listed", councillorName: "Thembinkosi Mathew Mjuza", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "coct", regionName: "Crossroads / Guguletu / Hlungulu Walk And Steve Biko Drive", councillorName: "Bongani Ngcombolo", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "coct", regionName: "Area not yet listed", councillorName: "Lindile Partmos Sonyoka", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "coct", regionName: "Adriaanse / Bishop Lavis / Myrtle Road And Tafelberg Road / Clarkes Estate (+1 more)", councillorName: "Charles Esau", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "coct", regionName: "Philippi / Strandfontein / Pavillion Road And Tidal Road / Weltevreden Road (+2 more)", councillorName: "Elton-Enrique Jansen", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "coct", regionName: "Bridgetown / Appledene Road And Petunia Road / Guguletu / Heideveld (+3 more)", councillorName: "Anthony Moses", approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "coct", regionName: "Coastal Park Landfill Site / Lavender Hill / Muizenberg / Seawinds (+1 more)", councillorName: "Mandy Marr", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "coct", regionName: "Belgravia / Elwyn Road And Hood Road / Gatesville / Hatton (+13 more)", councillorName: "Mogamat Cassiem", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "coct", regionName: "Hanover Park / Mountview / Newfields", councillorName: "Antonio van der Rheede", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "coct", regionName: "Athlone / Thornton Road / St. Athans Road / St. Gothas Road And St. Mauri Road (+15 more)", councillorName: "Zahid Badroodien", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "coct", regionName: "Athlone / Bangor Street And Newton Avenue / Bridgetown / Bosduif Road (+5 more)", councillorName: "Rashid Adams", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "coct", regionName: "Bonteheuwel / Sandalwood Street And Smalblaar Road", councillorName: "Angus McKenzie", approved: false, residentEstimate: null },
    { wardNumber: "51", municipalityId: "coct", regionName: "Langa / Unomusa Road / Ndlwana Way / Nkomo Way And Njoli Avenue (+3 more)", councillorName: "Lwazi Phakade", approved: false, residentEstimate: null },
    { wardNumber: "52", municipalityId: "coct", regionName: "Langa / Zone 15 Road / Zone 16 Road / Washington Drive (+4 more)", councillorName: "Thembelani Nyamakazi", approved: false, residentEstimate: null },
    { wardNumber: "53", municipalityId: "coct", regionName: "Epping Industria 1 / Maitland Garden Village / Maitland / The M5 Park (+7 more)", councillorName: "Riad Davids", approved: false, residentEstimate: null },
    { wardNumber: "54", municipalityId: "coct", regionName: "Bantry Bay / Camps Bay - Bakoven / Clifton / Fresnaye (+10 more)", councillorName: "Nicola Jowell", approved: false, residentEstimate: null },
    { wardNumber: "55", municipalityId: "coct", regionName: "Acacia Park / Brooklyn / Century City / Lagoon Beach (+13 more)", councillorName: "Fabian Ah-Sing", approved: false, residentEstimate: null },
    { wardNumber: "56", municipalityId: "coct", regionName: "Acacia Park / Kensington / Maitland / Windermere (+1 more)", councillorName: "Cheslyn Daniels", approved: false, residentEstimate: null },
    { wardNumber: "57", municipalityId: "coct", regionName: "District Six / Forest View / Mowbray / Cecil Road (+25 more)", councillorName: "Yusuf Mohamed", approved: false, residentEstimate: null },
    { wardNumber: "58", municipalityId: "coct", regionName: "Claremont / Kenilworth / Rondebosch", councillorName: "Richard Hill", approved: false, residentEstimate: null },
    { wardNumber: "59", municipalityId: "coct", regionName: "Claremont / Kenilworth / Newlands / Rondebosch (+4 more)", councillorName: "Mikhail Manuel", approved: false, residentEstimate: null },
    { wardNumber: "60", municipalityId: "coct", regionName: "Athlone / Lansdowne / Mowbray Golf Course / Black River And Settlers Drive (+2 more)", councillorName: "Mark Kleinschmidt", approved: false, residentEstimate: null },
    { wardNumber: "61", municipalityId: "coct", regionName: "Cape Point / Castle Rock / Glencairn / Kommetjie (+5 more)", councillorName: "Simon Liell-Cock", approved: false, residentEstimate: null },
    { wardNumber: "62", municipalityId: "coct", regionName: "Bishopscourt / Constantia / Newlands / Plumstead (+2 more)", councillorName: "Emile Langenhoven", approved: false, residentEstimate: null },
    { wardNumber: "63", municipalityId: "coct", regionName: "Diepriver / Ottery / Plumstead / Southfield (+2 more)", councillorName: "Carmen Siebritz", approved: false, residentEstimate: null },
    { wardNumber: "64", municipalityId: "coct", regionName: "Clovelly / Fish Hoek / Glencairn / Kalk Bay (+3 more)", councillorName: "Izabel Sherry", approved: false, residentEstimate: null },
    { wardNumber: "65", municipalityId: "coct", regionName: "Grassy Park / Lotus River / Raymond Circle / Monica Way (+1 more)", councillorName: "Donovan Nelson", approved: false, residentEstimate: null },
    { wardNumber: "66", municipalityId: "coct", regionName: "Lotus River / Stephen Road / Raymond Circle / Monica Way (+3 more)", councillorName: "William Akim", approved: false, residentEstimate: null },
    { wardNumber: "67", municipalityId: "coct", regionName: "Eagle Park / False Bay Coastal Park / Grassy Park / Victoria Road (+11 more)", councillorName: "Geraldine Gordon", approved: false, residentEstimate: null },
    { wardNumber: "68", municipalityId: "coct", regionName: "Lavender Hill / Retreat / Steenberg", councillorName: "Marita Petersen", approved: false, residentEstimate: null },
    { wardNumber: "69", municipalityId: "coct", regionName: "Chapmans Peak Drive And Noordhoek Beach / Fish Hoek / Kommetjie / Imhoff Waldorf Primary School (+3 more)", councillorName: "Patricia Francke", approved: false, residentEstimate: null },
    { wardNumber: "70", municipalityId: "coct", regionName: "Blomvlei / Bo Oakdale / Door De Kraal Farm / Hoheizen (+15 more)", councillorName: "Ronel Viljoen", approved: false, residentEstimate: null },
    { wardNumber: "71", municipalityId: "coct", regionName: "Constantia Hills / Kirstenhof / Norfolk Park / Orchard Village (+4 more)", councillorName: "Carolynne Franklin", approved: false, residentEstimate: null },
    { wardNumber: "72", municipalityId: "coct", regionName: "Elfindale / Heathfield / Retreat / Southfield", councillorName: "Kevin Southgate", approved: false, residentEstimate: null },
    { wardNumber: "73", municipalityId: "coct", regionName: "Bergvliet / Zwaanswyk Village / Constantia / Diep River (+8 more)", councillorName: "Edwin (Eddie) Andrews", approved: false, residentEstimate: null },
    { wardNumber: "74", municipalityId: "coct", regionName: "Hout Bay / Llandudno", councillorName: "Roberto Quintas", approved: false, residentEstimate: null },
    { wardNumber: "75", municipalityId: "coct", regionName: "Colorado Park / Highlands Village / Hyde Park / Morgans Village (+4 more)", councillorName: "Joan Woodman", approved: false, residentEstimate: null },
    { wardNumber: "76", municipalityId: "coct", regionName: "Ikwezi Park / Mandalay - Lentegeur", councillorName: "Avron Plaatjies", approved: false, residentEstimate: null },
    { wardNumber: "77", municipalityId: "coct", regionName: "Bo-Kaap / Cape Town City Centre / District Six / Keizergracht Road (+13 more)", councillorName: "Francine Higham", approved: false, residentEstimate: null },
    { wardNumber: "78", municipalityId: "coct", regionName: "Lentegeur / Mitchells Plain / Portland / Westridge", councillorName: "Goawa Timm", approved: false, residentEstimate: null },
    { wardNumber: "79", municipalityId: "coct", regionName: "Portland / Rocklands / Strandfontein", councillorName: "Daniel Christians", approved: false, residentEstimate: null },
    { wardNumber: "80", municipalityId: "coct", regionName: "Philippi / Ntukwane Street / Nkunzane Street / Singolamthi Street (+1 more)", councillorName: "Bennet Payiya", approved: false, residentEstimate: null },
    { wardNumber: "81", municipalityId: "coct", regionName: "Rocklands / Westgate / Westridge Mitchells Plain", councillorName: "Ashley Potts", approved: false, residentEstimate: null },
    { wardNumber: "82", municipalityId: "coct", regionName: "Tafelsig", councillorName: "Washiela Harris", approved: false, residentEstimate: null },
    { wardNumber: "83", municipalityId: "coct", regionName: "De Velde / Firgrove Rural / Gants Park / Goedehoop (+15 more)", councillorName: "Carl Punt", approved: false, residentEstimate: null },
    { wardNumber: "84", municipalityId: "coct", regionName: "Audas Estate / Bene Township / Berbago / Bizweni (+41 more)", councillorName: "Norman McFarlane", approved: false, residentEstimate: null },
    { wardNumber: "85", municipalityId: "coct", regionName: "Asanda Village / Asla Park / George Park / Greenways (+9 more)", councillorName: "Chantal Cerfontein", approved: false, residentEstimate: null },
    { wardNumber: "86", municipalityId: "coct", regionName: "Lwandle / Nomzamo / Simon Street / Selven Street (+1 more)", councillorName: "Xolani Diniso", approved: false, residentEstimate: null },
    { wardNumber: "87", municipalityId: "coct", regionName: "Mxolisi Phetani / Solomon Tshuku Avenue / Njongo Avenue / Limpopo Street", councillorName: "Khayalethu Kama", approved: false, residentEstimate: null },
    { wardNumber: "88", municipalityId: "coct", regionName: "Philippi Area Of Informality / Municipal Offices / Philippi Park / Philippi Pond Area (+3 more)", councillorName: "Zukisani Sophazi", approved: false, residentEstimate: null },
    { wardNumber: "89", municipalityId: "coct", regionName: "Driftsands / Nonqubela / Nondzaba Crescent / Gxashela Street", councillorName: "Kayalethu Gxasheka", approved: false, residentEstimate: null },
    { wardNumber: "90", municipalityId: "coct", regionName: "Bongani / Bangiso Drive / Sigwele Avenue / Tandazo Drive (+1 more)", councillorName: "Lukhanyo Simangweni", approved: false, residentEstimate: null },
    { wardNumber: "91", municipalityId: "coct", regionName: "Nonqubela / Mthathi Street / Sulani Drive / Victoria Mxenge (+3 more)", councillorName: "Thando Mpengezi", approved: false, residentEstimate: null },
    { wardNumber: "92", municipalityId: "coct", regionName: "Beacon Valley / Eastridge / Tafelsig", councillorName: "Norman Adonis", approved: false, residentEstimate: null },
    { wardNumber: "93", municipalityId: "coct", regionName: "Barnet Molokwana Corner / Driftsands / Nonqubela / Gxashela Street (+5 more)", councillorName: "Thando Pimpi", approved: false, residentEstimate: null },
    { wardNumber: "94", municipalityId: "coct", regionName: "Eyethu / Khaya", councillorName: "Xolisa Peter", approved: false, residentEstimate: null },
    { wardNumber: "95", municipalityId: "coct", regionName: "Kuyasa / Monwabisi / Fukutha Road / Lwesine Street (+9 more)", councillorName: "Ayanda Tetani", approved: false, residentEstimate: null },
    { wardNumber: "96", municipalityId: "coct", regionName: "Driftsands / Umrhabulo Triangle / Lindela Street / Dibana Road (+4 more)", councillorName: "Lucky Mbiza", approved: false, residentEstimate: null },
    { wardNumber: "97", municipalityId: "coct", regionName: "Area not yet listed", councillorName: "Mthwalo Alfred Mkutswana", approved: false, residentEstimate: null },
    { wardNumber: "98", municipalityId: "coct", regionName: "Harare / Ilitha Park", councillorName: "Anele Gabuza", approved: false, residentEstimate: null },
    { wardNumber: "99", municipalityId: "coct", regionName: "Endlovini Informal Settlement / Enkanini / Good Hope / Khayelitsha (+2 more)", councillorName: "Lonwabo Mqina", approved: false, residentEstimate: null },
    { wardNumber: "100", municipalityId: "coct", regionName: "Admirals Park / Anchorage Park / Antilles/Cayman Beach / Broadlands (+22 more)", councillorName: "Sean Stacey", approved: false, residentEstimate: null },
    { wardNumber: "101", municipalityId: "coct", regionName: "Belmont Park / Bloekombos / Kleinbegin / Kraaifontein East (+3 more)", councillorName: "Siyabonga  Duka", approved: false, residentEstimate: null },
    { wardNumber: "102", municipalityId: "coct", regionName: "Bonnie Brae / Bonnie Brook / Buh-Rein Estate / Cape Gate (+14 more)", councillorName: "Rhynhardt Bresler", approved: false, residentEstimate: null },
    { wardNumber: "103", municipalityId: "coct", regionName: "Amanda Glen / Avalon Estate / Cape Gate / Durbanville (+11 more)", councillorName: "Gerhard Fourie", approved: false, residentEstimate: null },
    { wardNumber: "104", municipalityId: "coct", regionName: "Brentwood Park / Cape Farms / District B / Du Noon (+3 more)", councillorName: "Bulelwa Mayende", approved: false, residentEstimate: null },
    { wardNumber: "105", municipalityId: "coct", regionName: "Cape Farms / Clara Anna Fontein / Durbanville / Durmonte (+17 more)", councillorName: "Francois Berry", approved: false, residentEstimate: null },
    { wardNumber: "106", municipalityId: "coct", regionName: "Delft 6 / Delft 7 / The Delft Cemetery - Delft South / Delft Main Road (+9 more)", councillorName: "Nobanathi Matutu (Luthango)", approved: false, residentEstimate: null },
    { wardNumber: "107", municipalityId: "coct", regionName: "Blouberg Sands", councillorName: "Jonathan Mills", approved: false, residentEstimate: null },
    { wardNumber: "108", municipalityId: "coct", regionName: "Area not yet listed", councillorName: "Nkosiphendule Lombi", approved: false, residentEstimate: null },
    { wardNumber: "109", municipalityId: "coct", regionName: "Bell Glen / Brandwacht / Chris Hani Park / Croydon (+16 more)", councillorName: "Peter Helfrich", approved: false, residentEstimate: null },
    { wardNumber: "110", municipalityId: "coct", regionName: "Grassy Park / Eighth Avenue / Geelhout Street / Italian Road And Eighth Avenue (+2 more)", councillorName: "Shanen Rossouw", approved: false, residentEstimate: null },
    { wardNumber: "111", municipalityId: "coct", regionName: "Belmont Park / Bracken Heights / Brackenfell Central / Brackenfell Industria (+11 more)", councillorName: "Brenda Hansen", approved: false, residentEstimate: null },
    { wardNumber: "112", municipalityId: "coct", regionName: "Arauna / Aurora / Durbanvale / Durbanville CBD (+14 more)", councillorName: "Theresa Uys", approved: false, residentEstimate: null },
    { wardNumber: "113", municipalityId: "coct", regionName: "District B / Flamingo Vlei / Killarney Gardens / Milnerton (+6 more)", councillorName: "Susan van der Linde", approved: false, residentEstimate: null },
    { wardNumber: "114", municipalityId: "coct", regionName: "Blue Downs / Brentwood Park / Driftsands / Mfuleni (+2 more)", councillorName: "Ernest Madikane", approved: false, residentEstimate: null },
    { wardNumber: "115", municipalityId: "coct", regionName: "Cape Town City Centre / Chiappini Street / Caste Street / Rose Street And Buitengracht Street (+12 more)", councillorName: "Ian McMahon", approved: false, residentEstimate: null },
    { wardNumber: "116", municipalityId: "coct", regionName: "Beacon Valley / The Imperial Primary School - Eastridge / Eastridge", councillorName: "Solomon Philander", approved: false, residentEstimate: null },
];

// Real data for coj (Ward 115 only) and coct (all 116 wards, added 25 Sep
// 2026). Every other municipality still maps to an empty array on purpose
// — that's what drives the honest "not yet connected" empty state on the
// directory page. Do not add plausible-looking placeholder wards/
// councillors here; that's exactly the fabricated-civic-data pattern this
// product has already had to remove twice this session.
//
// coct sourced from capetown.gov.za's live Council Hub Online tool
// (councillor name, party, real suburb list per ward), fetched 25 Sep 2026.
// 5 wards (28, 39, 41, 97, 108) aren't on that live listing — likely
// vacant/pending by-election — so those fall back to the IEC's 2021
// as-elected result instead, with no suburb list (regionName shows "Area
// not yet listed"). Full sourcing detail and raw data:
// _data-review/coct-wards-FINAL.json (git-tracked, not wired into any UI).
export const WARDS_BY_MUNICIPALITY: Record<string, WardListing[]> = {
  coj: [
    {
      wardNumber: "115",
      municipalityId: "coj",
      regionName: "Fourways / Bloubosrand",
      councillorName: "Mark Van Der Merwe",
      approved: true,
      residentEstimate: "~6,500 residents",
    },
  ],
  coct: COCT_WARDS,
  ethekwini: [],
  tshwane: [],
  ekurhuleni: [],
  "nelson-mandela-bay": [],
  "buffalo-city": [],
  mangaung: [],
  msunduzi: [],
};

function findWard(wardNumber: string): WardListing | null {
  for (const municipalityId of Object.keys(WARDS_BY_MUNICIPALITY)) {
    const match = WARDS_BY_MUNICIPALITY[municipalityId]?.find((w) => w.wardNumber === wardNumber);
    if (match) return match;
  }
  return null;
}

function municipalityName(municipalityId: string): string {
  return TOP_MUNICIPALITIES.find((m) => m.id === municipalityId)?.name ?? municipalityId;
}

export interface PublicWardSummary {
  wardNumber: string;
  regionName: string;
  municipalityName: string;
  councillorName: string | null;
  approved: boolean;
  residentEstimate: string | null;
  openReportCount: number | null;
}

function validateWardNumber(data: unknown): { wardNumber: string } {
  const wardNumber = (data as { wardNumber?: unknown })?.wardNumber;
  if (typeof wardNumber !== "string" || !wardNumber.trim()) {
    throw new Error("Ward number is required");
  }
  return { wardNumber: wardNumber.trim() };
}

// Public, no auth required — this is the directory/profile page's data
// source. Aggregate-only: never returns a raw ward_reports row or any
// reporter personal information, only a count, so it's safe to expose to
// unauthenticated visitors.
export const getPublicWardSummary = createServerFn({ method: "POST" })
  .validator(validateWardNumber)
  .handler(async ({ data }): Promise<PublicWardSummary | null> => {
    const ward = findWard(data.wardNumber);
    if (!ward) return null;

    let openReportCount: number | null = null;
    if (ward.approved) {
      const admin = getSupabaseAdmin();
      const { data: rows, error } = await admin
        .from("ward_reports")
        .select("status, dismissed_at")
        .eq("ward_number", ward.wardNumber);
      if (!error && rows) {
        openReportCount = rows.filter(
          (r) => !["resolved", "closed", "ignored"].includes(r.status) && r.dismissed_at == null,
        ).length;
      }
    }

    return {
      wardNumber: ward.wardNumber,
      regionName: ward.regionName,
      municipalityName: municipalityName(ward.municipalityId),
      councillorName: ward.councillorName,
      approved: ward.approved,
      residentEstimate: ward.residentEstimate,
      openReportCount,
    };
  });

export interface WardCommunityChannel {
  id: string;
  platform: "telegram" | "whatsapp" | "x" | "facebook";
  label: string | null;
  url: string;
}

async function fetchWardCommunityChannels(wardNumber: string): Promise<WardCommunityChannel[]> {
  const admin = getSupabaseAdmin();
  const { data: rows, error } = await admin
    .from("ward_community_channels")
    .select("id, platform, label, url")
    .eq("ward_number", wardNumber)
    .eq("active", true)
    .order("platform");

  if (error) throw new Error(error.message);
  return (rows ?? []) as WardCommunityChannel[];
}

// Public, no auth required — residents see these links on the ward profile
// page. Link storage only, see sql/2026-09-21-ward-community-channels.sql.
// Swallows errors (returns []) since an unauthenticated visitor shouldn't
// see a raw "table not found" message — the dashboard-side read below
// surfaces that to the councillor instead, where it's actionable.
export const getWardCommunityChannels = createServerFn({ method: "POST" })
  .validator(validateWardNumber)
  .handler(async ({ data }): Promise<WardCommunityChannel[]> => {
    try {
      return await fetchWardCommunityChannels(data.wardNumber);
    } catch {
      return [];
    }
  });

// Councillor-authenticated read for the dashboard's Community Channels
// tab — resolves the ward from the signed-in councillor's own approved
// profile, same pattern as getWardGroupLinks, rather than trusting a
// client-supplied ward number.
export const getMyWardCommunityChannels = createServerFn({ method: "POST" })
  .validator(validateAccessToken)
  .handler(async ({ data }): Promise<WardCommunityChannel[]> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }
    return fetchWardCommunityChannels(profile.wardNumber);
  });

const VALID_PLATFORMS = ["telegram", "whatsapp", "x", "facebook"] as const;

function validateSaveChannel(data: unknown): {
  accessToken: string;
  platform: (typeof VALID_PLATFORMS)[number];
  label: string;
  url: string;
} {
  const { accessToken } = validateAccessToken(data);
  const d = data as { platform?: unknown; label?: unknown; url?: unknown };
  if (typeof d.platform !== "string" || !VALID_PLATFORMS.includes(d.platform as never)) {
    throw new Error("Platform must be one of telegram, whatsapp, x, facebook");
  }
  if (typeof d.label !== "string" || !d.label.trim() || d.label.trim().length > 50) {
    throw new Error("Label is required and must be 50 characters or fewer");
  }
  if (typeof d.url !== "string" || !d.url.trim().startsWith("https://")) {
    throw new Error("Link must be a full https:// URL");
  }
  return {
    accessToken,
    platform: d.platform as (typeof VALID_PLATFORMS)[number],
    label: d.label.trim(),
    url: d.url.trim(),
  };
}

// Councillor-only write, same approval-gated pattern as saveWardGroupLink.
// Saving a link here never sends anything anywhere — see the migration
// file's header comment.
export const saveWardCommunityChannel = createServerFn({ method: "POST" })
  .validator(validateSaveChannel)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("ward_community_channels").upsert(
      {
        ward_number: profile.wardNumber,
        platform: data.platform,
        label: data.label,
        url: data.url,
        active: true,
      },
      { onConflict: "ward_number,platform" },
    );

    if (error) {
      throw new Error(`Could not save channel: ${error.message}`);
    }
    return { ok: true };
  });

function validateChannelId(data: unknown): { accessToken: string; id: string } {
  const { accessToken } = validateAccessToken(data);
  const id = (data as { id?: unknown })?.id;
  if (typeof id !== "string" || !id) {
    throw new Error("Missing channel id");
  }
  return { accessToken, id };
}

export const deactivateWardCommunityChannel = createServerFn({ method: "POST" })
  .validator(validateChannelId)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { profile } = await requireCouncillorProfile(data.accessToken);
    if (!profile || !profile.approved) {
      throw new Error("Your councillor account has not been approved yet");
    }

    const admin = getSupabaseAdmin();
    const { error } = await admin
      .from("ward_community_channels")
      .update({ active: false })
      .eq("id", data.id)
      .eq("ward_number", profile.wardNumber);

    if (error) {
      throw new Error(`Could not remove channel: ${error.message}`);
    }
    return { ok: true };
  });
