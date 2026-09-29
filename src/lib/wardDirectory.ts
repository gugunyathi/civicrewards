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
  { id: "ethekwini", name: "eThekwini Metropolitan Municipality (Durban)", abbreviation: "eThekwini", connected: true },
  { id: "tshwane", name: "City of Tshwane (Pretoria)", abbreviation: "CoT", connected: true },
  { id: "ekurhuleni", name: "Ekurhuleni Metropolitan Municipality (East Rand)", abbreviation: "EMM", connected: true },
  { id: "nelson-mandela-bay", name: "Nelson Mandela Bay Metropolitan Municipality (Gqeberha)", abbreviation: "NMBM", connected: true },
  { id: "buffalo-city", name: "Buffalo City Metropolitan Municipality (East London)", abbreviation: "BCMM", connected: true },
  { id: "mangaung", name: "Mangaung Metropolitan Municipality (Bloemfontein)", abbreviation: "MMM", connected: true },
  { id: "msunduzi", name: "Msunduzi Local Municipality (Pietermaritzburg)", abbreviation: "Msunduzi", connected: true },
];

export interface WardListing {
  wardNumber: string;
  municipalityId: string;
  party: string | null;
  regionName: string;
  councillorName: string | null;
  approved: boolean;
  residentEstimate: string | null;
}

const MANGAUNG_WARDS: WardListing[] = [
    { wardNumber: "1", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Samuel Sefaki", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tona Kenosi Wilfred Mokgothu", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tshepiso Oudisious Machachamise", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mahoko Harold Supi", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lehlohonolo Nathaniel Lecoko", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tshidiso Petrus Moiloa", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Siza Clement Sehloho", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Likeleli Julia Nyaphudi", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Betty Masethlabi Tlhakung", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Teboho Lesley Setlai", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Motlhokung Theodorah Mosala", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Rafedile Hashatsi", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nombulelo Dorcas Sitoe", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lebogang Winston Lekgetho", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Pulane Martha Mohibidu", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Caprice Logan Kruger", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mampone Sally Mohatle", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "David Mark Campbell Mckay", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Seth Qondile Peter", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Werner Pretorius", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Pieter Adam Lotriet", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Dulandi Leech", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Tjaart Botha Van Der Walt", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Gerhardus Dirk Petrus Kotzé", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Francois Rossouw Botes", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Hendrik Johannes Christiaan Van Niekerk", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zachous Nechodemus Banyane", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Vumile Edwin Nikelo", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Dikololo Elias Matsephe", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Teboho Daniel Tukule", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mere Joel Mabena", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thabang Victor Menyatso", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tshidiso Augustine Mohono", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Kabi Daniel Tshwane", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Teboho Samuel Fantisi", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Itumeleng Justice Makoloane", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mmota Simon Ramolelle", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Molahlone Florenciah Matsoso", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thabo Joel Mogotloane", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ntebaleng Pertunia Pholoholo", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mantja Agnes Dintlhwane", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Maqoma Lazarus Mothupi", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mpho Elizabeth Nkiane", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Selmé Pretorius", approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lisiwe Jeanette Mathe", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mpho Samuel Majoro", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Mokgadi Kganakga", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "mangaung", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Johannes Christiaan Pretorius", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Julia Mohanuwa Lekhwele", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thabo Nicholus Monare", approved: false, residentEstimate: null },
    { wardNumber: "51", municipalityId: "mangaung", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mamoorosi Margaret Mohulatsi", approved: false, residentEstimate: null },
];

const COCT_WARDS: WardListing[] = [
    { wardNumber: "1", municipalityId: "coct", party: "Democratic Alliance", regionName: "Baronetcy Estate / De Duin / De Grendel Farm / Kaapzicht (+10 more)", councillorName: "Cheryl Visser", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "coct", party: "Democratic Alliance", regionName: "Belvedere Tygerberg / Bosbell / Boston / Churchill Estate (+8 more)", councillorName: "Roger Cannon", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bellair / Blommendal / Blomtuin / Chrismar (+12 more)", councillorName: "Annelize Van Zyl", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "coct", party: "Democratic Alliance", regionName: "Joe Slovo Park / Milnerton Ridge / Montague Gardens / Phoenix (+3 more)", councillorName: "Anthony Benadie", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "coct", party: "Democratic Alliance", regionName: "Annandale Farm / Atlas Gardens Business Park / Bothasig / Burgundy Estate (+7 more)", councillorName: "Miquette Temlett", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "coct", party: "African National Congress", regionName: "Belmont Park / Botfontein Smallholdings / Wallacedene / Thakudi Street (+1 more)", councillorName: "Siviwe Nodliwa", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "coct", party: "Democratic Alliance", regionName: "Botfontein Smallholdings / Bottelary Smallholdings / Brackenfell South / Stonewood Street (+7 more)", councillorName: "Gabriel Twigg", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "coct", party: "Democratic Alliance", regionName: "Annandale / Brackenfell Central / Brackenfell Common / Brackenfell South (+16 more)", councillorName: "Johann Loots", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bellville Landfill / Bellville South / Bellville South Industrial / CPUT (+9 more)", councillorName: "Mercia Kleinsmith", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "coct", party: "Democratic Alliance", regionName: "Avondale / Beaconvale / Belgravia / Bellrail (+23 more)", councillorName: "Jacoline Visser", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "coct", party: "Democratic Alliance", regionName: "Amandelrug / Amandelsig / Bellville Teachers College / Benno Park (+25 more)", councillorName: "Pieter  de Vos", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "coct", party: "Democratic Alliance", regionName: "Belhar Ext 10 / Belhar Ext 11 / Belhar Ext 12 / Belhar Ext 13 (+14 more)", councillorName: "Willie  Jaftha", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "coct", party: "Democratic Alliance", regionName: "Delft 1 & 2 / Delft 3 / Delft 4 / Delft 5 (+3 more)", councillorName: "Michelle Adonis", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "coct", party: "Democratic Alliance", regionName: "Aan De Wijmlanden Estate / Austinville / Blackheath Industria / Blue Owns Cbd (+25 more)", councillorName: "Kariena Mare", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bel'Aire / Braeview / Briza / Die Wingerd (+18 more)", councillorName: "Gregory Peck", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "coct", party: "Democratic Alliance", regionName: "Dreamworld / Driftsands / Eersterivier South / Eersterivier (+2 more)", councillorName: "Ursula Barends", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "coct", party: "Democratic Alliance", regionName: "Dennemere / Forest Heights / Hillcrest Heights / Kleinvlei Town (+5 more)", councillorName: "Frans Sauls", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "coct", party: "African National Congress", regionName: "Mxolisi Phetani / Thembokwezi", councillorName: "Ntomboxolo Kopman", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "coct", party: "Democratic Alliance", regionName: "Camelot / Hagley / Highbury / Highbury Park (+8 more)", councillorName: "Ebrahim Sawant", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "coct", party: "Democratic Alliance", regionName: "Leiden / Usutu Pos And Homtini Street / Voorbrug", councillorName: "Dineo Masiu", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "coct", party: "Democratic Alliance", regionName: "Amanda Glen / Bethanie / Bloemhof / Bo Oakdale (+20 more)", councillorName: "Hendri Terblanche", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "coct", party: "Democratic Alliance", regionName: "Belhar Ext 1 / Belhar Ext 17 / Belhar Ext 2 / Belhar Ext 3 (+12 more)", councillorName: "Johanna Martlow", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "coct", party: "Democratic Alliance", regionName: "Big Bay / Blaauwbergstrand / Cape Farms / District B (+8 more)", councillorName: "Paul Swart", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "coct", party: "African National Congress", regionName: "Cape Town Airport / Delft South / Basboom Road / Welwitschia Crescent (+1 more)", councillorName: "Phumla  Tause", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "coct", party: "Democratic Alliance", regionName: "Connaught / Cravenby / Eureka Estate / Florida (+2 more)", councillorName: "Beverley van Reenen", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "coct", party: "Democratic Alliance", regionName: "Avon / Beaconvale / Elsies River Industria / Leonsdale (+8 more)", councillorName: "Franchesca Walker", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "coct", party: "Democratic Alliance", regionName: "Glenwood / Goodwood Estate / Goodwood Ext 1 / Montague (+5 more)", councillorName: "Cecile Janse van Rensburg", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "coct", party: "DEMOCRATIC ALLIANCE", regionName: "Area not yet listed", councillorName: "Christopher Jordaan", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "coct", party: "Democratic Alliance", regionName: "Atlantis Industrial / Avondale / Westfleur / Cape Farms (+9 more)", councillorName: "Allister Lightburn", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "coct", party: "Democratic Alliance", regionName: "Manenberg / Hex Crescent / Tousberg Road / Duinefontein Road (+5 more)", councillorName: "Deidree De Vos", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bishop Lavis / Bonteheuwel / Sandalwood Street And Smalblaar Road / Boquinar Industrial Area (+6 more)", councillorName: "Theresa Thompson", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "coct", party: "Democratic Alliance", regionName: "Atlantis Industrial / Avondale / Beacon Hill / Protea Park (+7 more)", councillorName: "Moosa Raise", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "coct", party: "African National Congress", regionName: "Aan De Wijmlanden Estate", councillorName: "Lungisa Somdaka", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "coct", party: "African National Congress", regionName: "Philippi / Ngcisininde Crescent / Govan Mbeki Road / Mildred Holo Street (+1 more)", councillorName: "Melikhaya Gadeni", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "coct", party: "African National Congress", regionName: "Philippi / Kabodi Street / Ngcisininde Crescent / Bristol Road (+4 more)", councillorName: "Mboniswa Chitha", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "coct", party: "African National Congress", regionName: "Crossroads / Philippi", councillorName: "Nceba Ntshweza", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "coct", party: "African National Congress", regionName: "Crossroads / Nyanga / Ntlangano Crescent And Terminus Road", councillorName: "Lionel Martin", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "coct", party: "African National Congress", regionName: "Crossroads", councillorName: "Suzanne Zumana", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "coct", party: "AFRICAN NATIONAL CONGRESS", regionName: "Area not yet listed", councillorName: "Thembinkosi Mathew Mjuza", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "coct", party: "African National Congress", regionName: "Crossroads / Guguletu / Hlungulu Walk And Steve Biko Drive", councillorName: "Bongani Ngcombolo", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "coct", party: "AFRICAN NATIONAL CONGRESS", regionName: "Area not yet listed", councillorName: "Lindile Partmos Sonyoka", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "coct", party: "Democratic Alliance", regionName: "Adriaanse / Bishop Lavis / Myrtle Road And Tafelberg Road / Clarkes Estate (+1 more)", councillorName: "Charles Esau", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "coct", party: "Democratic Alliance", regionName: "Philippi / Strandfontein / Pavillion Road And Tidal Road / Weltevreden Road (+2 more)", councillorName: "Elton-Enrique Jansen", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bridgetown / Appledene Road And Petunia Road / Guguletu / Heideveld (+3 more)", councillorName: "Anthony Moses", approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "coct", party: "Democratic Alliance", regionName: "Coastal Park Landfill Site / Lavender Hill / Muizenberg / Seawinds (+1 more)", councillorName: "Mandy Marr", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "coct", party: "Democratic Alliance", regionName: "Belgravia / Elwyn Road And Hood Road / Gatesville / Hatton (+13 more)", councillorName: "Mogamat Cassiem", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "coct", party: "Democratic Alliance", regionName: "Hanover Park / Mountview / Newfields", councillorName: "Antonio van der Rheede", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "coct", party: "Democratic Alliance", regionName: "Athlone / Thornton Road / St. Athans Road / St. Gothas Road And St. Mauri Road (+15 more)", councillorName: "Zahid Badroodien", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "coct", party: "Democratic Alliance", regionName: "Athlone / Bangor Street And Newton Avenue / Bridgetown / Bosduif Road (+5 more)", councillorName: "Rashid Adams", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bonteheuwel / Sandalwood Street And Smalblaar Road", councillorName: "Angus McKenzie", approved: false, residentEstimate: null },
    { wardNumber: "51", municipalityId: "coct", party: "African National Congress", regionName: "Langa / Unomusa Road / Ndlwana Way / Nkomo Way And Njoli Avenue (+3 more)", councillorName: "Lwazi Phakade", approved: false, residentEstimate: null },
    { wardNumber: "52", municipalityId: "coct", party: "African National Congress", regionName: "Langa / Zone 15 Road / Zone 16 Road / Washington Drive (+4 more)", councillorName: "Thembelani Nyamakazi", approved: false, residentEstimate: null },
    { wardNumber: "53", municipalityId: "coct", party: "Democratic Alliance", regionName: "Epping Industria 1 / Maitland Garden Village / Maitland / The M5 Park (+7 more)", councillorName: "Riad Davids", approved: false, residentEstimate: null },
    { wardNumber: "54", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bantry Bay / Camps Bay - Bakoven / Clifton / Fresnaye (+10 more)", councillorName: "Nicola Jowell", approved: false, residentEstimate: null },
    { wardNumber: "55", municipalityId: "coct", party: "Democratic Alliance", regionName: "Acacia Park / Brooklyn / Century City / Lagoon Beach (+13 more)", councillorName: "Fabian Ah-Sing", approved: false, residentEstimate: null },
    { wardNumber: "56", municipalityId: "coct", party: "Patriotic Alliance", regionName: "Acacia Park / Kensington / Maitland / Windermere (+1 more)", councillorName: "Cheslyn Daniels", approved: false, residentEstimate: null },
    { wardNumber: "57", municipalityId: "coct", party: "Democratic Alliance", regionName: "District Six / Forest View / Mowbray / Cecil Road (+25 more)", councillorName: "Yusuf Mohamed", approved: false, residentEstimate: null },
    { wardNumber: "58", municipalityId: "coct", party: "Democratic Alliance", regionName: "Claremont / Kenilworth / Rondebosch", councillorName: "Richard Hill", approved: false, residentEstimate: null },
    { wardNumber: "59", municipalityId: "coct", party: "Democratic Alliance", regionName: "Claremont / Kenilworth / Newlands / Rondebosch (+4 more)", councillorName: "Mikhail Manuel", approved: false, residentEstimate: null },
    { wardNumber: "60", municipalityId: "coct", party: "Democratic Alliance", regionName: "Athlone / Lansdowne / Mowbray Golf Course / Black River And Settlers Drive (+2 more)", councillorName: "Mark Kleinschmidt", approved: false, residentEstimate: null },
    { wardNumber: "61", municipalityId: "coct", party: "Democratic Alliance", regionName: "Cape Point / Castle Rock / Glencairn / Kommetjie (+5 more)", councillorName: "Simon Liell-Cock", approved: false, residentEstimate: null },
    { wardNumber: "62", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bishopscourt / Constantia / Newlands / Plumstead (+2 more)", councillorName: "Emile Langenhoven", approved: false, residentEstimate: null },
    { wardNumber: "63", municipalityId: "coct", party: "Democratic Alliance", regionName: "Diepriver / Ottery / Plumstead / Southfield (+2 more)", councillorName: "Carmen Siebritz", approved: false, residentEstimate: null },
    { wardNumber: "64", municipalityId: "coct", party: "Democratic Alliance", regionName: "Clovelly / Fish Hoek / Glencairn / Kalk Bay (+3 more)", councillorName: "Izabel Sherry", approved: false, residentEstimate: null },
    { wardNumber: "65", municipalityId: "coct", party: "Democratic Alliance", regionName: "Grassy Park / Lotus River / Raymond Circle / Monica Way (+1 more)", councillorName: "Donovan Nelson", approved: false, residentEstimate: null },
    { wardNumber: "66", municipalityId: "coct", party: "Democratic Alliance", regionName: "Lotus River / Stephen Road / Raymond Circle / Monica Way (+3 more)", councillorName: "William Akim", approved: false, residentEstimate: null },
    { wardNumber: "67", municipalityId: "coct", party: "Democratic Alliance", regionName: "Eagle Park / False Bay Coastal Park / Grassy Park / Victoria Road (+11 more)", councillorName: "Geraldine Gordon", approved: false, residentEstimate: null },
    { wardNumber: "68", municipalityId: "coct", party: "Democratic Alliance", regionName: "Lavender Hill / Retreat / Steenberg", councillorName: "Marita Petersen", approved: false, residentEstimate: null },
    { wardNumber: "69", municipalityId: "coct", party: "Democratic Alliance", regionName: "Chapmans Peak Drive And Noordhoek Beach / Fish Hoek / Kommetjie / Imhoff Waldorf Primary School (+3 more)", councillorName: "Patricia Francke", approved: false, residentEstimate: null },
    { wardNumber: "70", municipalityId: "coct", party: "Democratic Alliance", regionName: "Blomvlei / Bo Oakdale / Door De Kraal Farm / Hoheizen (+15 more)", councillorName: "Ronel Viljoen", approved: false, residentEstimate: null },
    { wardNumber: "71", municipalityId: "coct", party: "Democratic Alliance", regionName: "Constantia Hills / Kirstenhof / Norfolk Park / Orchard Village (+4 more)", councillorName: "Carolynne Franklin", approved: false, residentEstimate: null },
    { wardNumber: "72", municipalityId: "coct", party: "Democratic Alliance", regionName: "Elfindale / Heathfield / Retreat / Southfield", councillorName: "Kevin Southgate", approved: false, residentEstimate: null },
    { wardNumber: "73", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bergvliet / Zwaanswyk Village / Constantia / Diep River (+8 more)", councillorName: "Edwin (Eddie) Andrews", approved: false, residentEstimate: null },
    { wardNumber: "74", municipalityId: "coct", party: "Democratic Alliance", regionName: "Hout Bay / Llandudno", councillorName: "Roberto Quintas", approved: false, residentEstimate: null },
    { wardNumber: "75", municipalityId: "coct", party: "Democratic Alliance", regionName: "Colorado Park / Highlands Village / Hyde Park / Morgans Village (+4 more)", councillorName: "Joan Woodman", approved: false, residentEstimate: null },
    { wardNumber: "76", municipalityId: "coct", party: "Democratic Alliance", regionName: "Ikwezi Park / Mandalay - Lentegeur", councillorName: "Avron Plaatjies", approved: false, residentEstimate: null },
    { wardNumber: "77", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bo-Kaap / Cape Town City Centre / District Six / Keizergracht Road (+13 more)", councillorName: "Francine Higham", approved: false, residentEstimate: null },
    { wardNumber: "78", municipalityId: "coct", party: "Democratic Alliance", regionName: "Lentegeur / Mitchells Plain / Portland / Westridge", councillorName: "Goawa Timm", approved: false, residentEstimate: null },
    { wardNumber: "79", municipalityId: "coct", party: "Democratic Alliance", regionName: "Portland / Rocklands / Strandfontein", councillorName: "Daniel Christians", approved: false, residentEstimate: null },
    { wardNumber: "80", municipalityId: "coct", party: "African National Congress", regionName: "Philippi / Ntukwane Street / Nkunzane Street / Singolamthi Street (+1 more)", councillorName: "Bennet Payiya", approved: false, residentEstimate: null },
    { wardNumber: "81", municipalityId: "coct", party: "Democratic Alliance", regionName: "Rocklands / Westgate / Westridge Mitchells Plain", councillorName: "Ashley Potts", approved: false, residentEstimate: null },
    { wardNumber: "82", municipalityId: "coct", party: "Democratic Alliance", regionName: "Tafelsig", councillorName: "Washiela Harris", approved: false, residentEstimate: null },
    { wardNumber: "83", municipalityId: "coct", party: "Democratic Alliance", regionName: "De Velde / Firgrove Rural / Gants Park / Goedehoop (+15 more)", councillorName: "Carl Punt", approved: false, residentEstimate: null },
    { wardNumber: "84", municipalityId: "coct", party: "Democratic Alliance", regionName: "Audas Estate / Bene Township / Berbago / Bizweni (+41 more)", councillorName: "Norman McFarlane", approved: false, residentEstimate: null },
    { wardNumber: "85", municipalityId: "coct", party: "Democratic Alliance", regionName: "Asanda Village / Asla Park / George Park / Greenways (+9 more)", councillorName: "Chantal Cerfontein", approved: false, residentEstimate: null },
    { wardNumber: "86", municipalityId: "coct", party: "African National Congress", regionName: "Lwandle / Nomzamo / Simon Street / Selven Street (+1 more)", councillorName: "Xolani Diniso", approved: false, residentEstimate: null },
    { wardNumber: "87", municipalityId: "coct", party: "African National Congress", regionName: "Mxolisi Phetani / Solomon Tshuku Avenue / Njongo Avenue / Limpopo Street", councillorName: "Khayalethu Kama", approved: false, residentEstimate: null },
    { wardNumber: "88", municipalityId: "coct", party: "African National Congress", regionName: "Philippi Area Of Informality / Municipal Offices / Philippi Park / Philippi Pond Area (+3 more)", councillorName: "Zukisani Sophazi", approved: false, residentEstimate: null },
    { wardNumber: "89", municipalityId: "coct", party: "African National Congress", regionName: "Driftsands / Nonqubela / Nondzaba Crescent / Gxashela Street", councillorName: "Kayalethu Gxasheka", approved: false, residentEstimate: null },
    { wardNumber: "90", municipalityId: "coct", party: "African National Congress", regionName: "Bongani / Bangiso Drive / Sigwele Avenue / Tandazo Drive (+1 more)", councillorName: "Lukhanyo Simangweni", approved: false, residentEstimate: null },
    { wardNumber: "91", municipalityId: "coct", party: "African National Congress", regionName: "Nonqubela / Mthathi Street / Sulani Drive / Victoria Mxenge (+3 more)", councillorName: "Thando Mpengezi", approved: false, residentEstimate: null },
    { wardNumber: "92", municipalityId: "coct", party: "Democratic Alliance", regionName: "Beacon Valley / Eastridge / Tafelsig", councillorName: "Norman Adonis", approved: false, residentEstimate: null },
    { wardNumber: "93", municipalityId: "coct", party: "African National Congress", regionName: "Barnet Molokwana Corner / Driftsands / Nonqubela / Gxashela Street (+5 more)", councillorName: "Thando Pimpi", approved: false, residentEstimate: null },
    { wardNumber: "94", municipalityId: "coct", party: "African National Congress", regionName: "Eyethu / Khaya", councillorName: "Xolisa Peter", approved: false, residentEstimate: null },
    { wardNumber: "95", municipalityId: "coct", party: "African National Congress", regionName: "Kuyasa / Monwabisi / Fukutha Road / Lwesine Street (+9 more)", councillorName: "Ayanda Tetani", approved: false, residentEstimate: null },
    { wardNumber: "96", municipalityId: "coct", party: "African National Congress", regionName: "Driftsands / Umrhabulo Triangle / Lindela Street / Dibana Road (+4 more)", councillorName: "Lucky Mbiza", approved: false, residentEstimate: null },
    { wardNumber: "97", municipalityId: "coct", party: "AFRICAN NATIONAL CONGRESS", regionName: "Area not yet listed", councillorName: "Mthwalo Alfred Mkutswana", approved: false, residentEstimate: null },
    { wardNumber: "98", municipalityId: "coct", party: "African National Congress", regionName: "Harare / Ilitha Park", councillorName: "Anele Gabuza", approved: false, residentEstimate: null },
    { wardNumber: "99", municipalityId: "coct", party: "African National Congress", regionName: "Endlovini Informal Settlement / Enkanini / Good Hope / Khayelitsha (+2 more)", councillorName: "Lonwabo Mqina", approved: false, residentEstimate: null },
    { wardNumber: "100", municipalityId: "coct", party: "Democratic Alliance", regionName: "Admirals Park / Anchorage Park / Antilles/Cayman Beach / Broadlands (+22 more)", councillorName: "Sean Stacey", approved: false, residentEstimate: null },
    { wardNumber: "101", municipalityId: "coct", party: "African National Congress", regionName: "Belmont Park / Bloekombos / Kleinbegin / Kraaifontein East (+3 more)", councillorName: "Siyabonga  Duka", approved: false, residentEstimate: null },
    { wardNumber: "102", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bonnie Brae / Bonnie Brook / Buh-Rein Estate / Cape Gate (+14 more)", councillorName: "Rhynhardt Bresler", approved: false, residentEstimate: null },
    { wardNumber: "103", municipalityId: "coct", party: "Democratic Alliance", regionName: "Amanda Glen / Avalon Estate / Cape Gate / Durbanville (+11 more)", councillorName: "Gerhard Fourie", approved: false, residentEstimate: null },
    { wardNumber: "104", municipalityId: "coct", party: "African National Congress", regionName: "Brentwood Park / Cape Farms / District B / Du Noon (+3 more)", councillorName: "Bulelwa Mayende", approved: false, residentEstimate: null },
    { wardNumber: "105", municipalityId: "coct", party: "Democratic Alliance", regionName: "Cape Farms / Clara Anna Fontein / Durbanville / Durmonte (+17 more)", councillorName: "Francois Berry", approved: false, residentEstimate: null },
    { wardNumber: "106", municipalityId: "coct", party: "African National Congress", regionName: "Delft 6 / Delft 7 / The Delft Cemetery - Delft South / Delft Main Road (+9 more)", councillorName: "Nobanathi Matutu (Luthango)", approved: false, residentEstimate: null },
    { wardNumber: "107", municipalityId: "coct", party: "Democratic Alliance", regionName: "Blouberg Sands", councillorName: "Jonathan Mills", approved: false, residentEstimate: null },
    { wardNumber: "108", municipalityId: "coct", party: "AFRICAN NATIONAL CONGRESS", regionName: "Area not yet listed", councillorName: "Nkosiphendule Lombi", approved: false, residentEstimate: null },
    { wardNumber: "109", municipalityId: "coct", party: "Democratic Alliance", regionName: "Bell Glen / Brandwacht / Chris Hani Park / Croydon (+16 more)", councillorName: "Peter Helfrich", approved: false, residentEstimate: null },
    { wardNumber: "110", municipalityId: "coct", party: "Democratic Alliance", regionName: "Grassy Park / Eighth Avenue / Geelhout Street / Italian Road And Eighth Avenue (+2 more)", councillorName: "Shanen Rossouw", approved: false, residentEstimate: null },
    { wardNumber: "111", municipalityId: "coct", party: "Democratic Alliance", regionName: "Belmont Park / Bracken Heights / Brackenfell Central / Brackenfell Industria (+11 more)", councillorName: "Brenda Hansen", approved: false, residentEstimate: null },
    { wardNumber: "112", municipalityId: "coct", party: "Democratic Alliance", regionName: "Arauna / Aurora / Durbanvale / Durbanville CBD (+14 more)", councillorName: "Theresa Uys", approved: false, residentEstimate: null },
    { wardNumber: "113", municipalityId: "coct", party: "Democratic Alliance", regionName: "District B / Flamingo Vlei / Killarney Gardens / Milnerton (+6 more)", councillorName: "Susan van der Linde", approved: false, residentEstimate: null },
    { wardNumber: "114", municipalityId: "coct", party: "African National Congress", regionName: "Blue Downs / Brentwood Park / Driftsands / Mfuleni (+2 more)", councillorName: "Ernest Madikane", approved: false, residentEstimate: null },
    { wardNumber: "115", municipalityId: "coct", party: "Democratic Alliance", regionName: "Cape Town City Centre / Chiappini Street / Caste Street / Rose Street And Buitengracht Street (+12 more)", councillorName: "Ian McMahon", approved: false, residentEstimate: null },
    { wardNumber: "116", municipalityId: "coct", party: "Democratic Alliance", regionName: "Beacon Valley / The Imperial Primary School - Eastridge / Eastridge", councillorName: "Solomon Philander", approved: false, residentEstimate: null },
];

const ETHEKWINI_WARDS: WardListing[] = [
    { wardNumber: "1", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Braveman Thembubuhle Ntuli", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Wilfred Makhosini Luthuli", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mpilenhle Eldridge Mkhize", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Petros Hella Nxumalo", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sbusiso Blessing Ngcongo", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Freedom Nkosinathi Majola", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Luthando Bulelani Sonwabile Jali", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Marco Mbambo", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Nonsikelelo Pearl Msomi", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Terence Peter Collins", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Graeme Derek Clarivette", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Dumsane Maxwell Nsundwane", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Reginald Cloete", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Gabriel Mthokozisi Gasa", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thembelani Ephraime Shezi", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "David Bongani Ngubane", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sibusiso Nonoza Cedrick Khwela", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Melanie Brauteseth", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sikhanyiso Desmond Hlongwa", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Khulekani Terrence Mbhele", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nelisiwe Nesta Nyanisa", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mirriam Vumile Nzimande-Madlala", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Alicia Kissoon", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Hugh Sikhumbuzo Makhathini", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Themba Jetro Mkhize", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sbusiso Welcome Lushaba", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Ernest Grenville Smith", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ntandoyenkosi Lucky Khuzwayo", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bhekisisa Richard Mngadi", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Warren Jerome De Marigny Burne", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Remona Letisha Mckenzie", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mzokuthoba Rotas Mngonyama", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Sakhile Mngadi", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Ashok Maharajh", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Nicole Jane Bollman", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Shontel Veronica De Boer", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ntombizodwa Jephrina Maphumulo", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Muzikayise Thusi", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "ethekwini", party: "Inkatha Freedom Party", regionName: "Area not yet listed", councillorName: "Mzwethu Sandile Gwala", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sithembiso Kenneth Mzimela", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Jacob Nhlanhla Sibisi", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Derrick Fisokuhle Mngadi", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Gloria Nelisiwe Mhlongo", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bhekokwakhe Welcome Phewa", approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mafi Zondi", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sihle Herman Mazibuko", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Phiwayinkosi Cedric Ntshangase", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Michelle Lutchmen", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Danovan Pillay", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Eurika Lyndal Singh", approved: false, residentEstimate: null },
    { wardNumber: "51", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Managi Johnson", approved: false, residentEstimate: null },
    { wardNumber: "52", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Samier Singh", approved: false, residentEstimate: null },
    { wardNumber: "53", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nonceba Thelma Tyelinzima", approved: false, residentEstimate: null },
    { wardNumber: "54", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Themba Joseph Mnguni", approved: false, residentEstimate: null },
    { wardNumber: "55", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Siyabonga Patrick Mfeka", approved: false, residentEstimate: null },
    { wardNumber: "56", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Siyabonga Hopewell Ntombela", approved: false, residentEstimate: null },
    { wardNumber: "57", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Vincent Kunju", approved: false, residentEstimate: null },
    { wardNumber: "58", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Geoffrey Douglas Ayrton Pullan", approved: false, residentEstimate: null },
    { wardNumber: "59", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkosiyezwe Moyawezwi Mhlongo", approved: false, residentEstimate: null },
    { wardNumber: "60", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Witness Fakazi Mdletshe", approved: false, residentEstimate: null },
    { wardNumber: "61", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Nagammah Munien", approved: false, residentEstimate: null },
    { wardNumber: "62", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thobekani Hudson Nene", approved: false, residentEstimate: null },
    { wardNumber: "63", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Jan Christoffel Van Den Berg", approved: false, residentEstimate: null },
    { wardNumber: "64", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Gavin James Hegter", approved: false, residentEstimate: null },
    { wardNumber: "65", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Samantha Magdalene Windvogel", approved: false, residentEstimate: null },
    { wardNumber: "66", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Zoë Adele Solomon", approved: false, residentEstimate: null },
    { wardNumber: "67", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sipepelo Mnyandu", approved: false, residentEstimate: null },
    { wardNumber: "68", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Aubrey Desmond Snyman", approved: false, residentEstimate: null },
    { wardNumber: "69", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Ganas Govender", approved: false, residentEstimate: null },
    { wardNumber: "70", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Sathasivan Govender", approved: false, residentEstimate: null },
    { wardNumber: "71", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Fatima Ismail", approved: false, residentEstimate: null },
    { wardNumber: "72", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sibusiso Bhekisisa Mpanza", approved: false, residentEstimate: null },
    { wardNumber: "73", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Devaraj Rama Pillay", approved: false, residentEstimate: null },
    { wardNumber: "74", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Octavia Nolubabalo Zondi", approved: false, residentEstimate: null },
    { wardNumber: "75", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Blessed Sibusiso Sivetye", approved: false, residentEstimate: null },
    { wardNumber: "76", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Jabulani Bhekisisa Maphumulo", approved: false, residentEstimate: null },
    { wardNumber: "77", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Anoop Rampersad", approved: false, residentEstimate: null },
    { wardNumber: "78", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zakhele Ozias Mnomiya", approved: false, residentEstimate: null },
    { wardNumber: "79", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Khumbulani Professor Michael Cele", approved: false, residentEstimate: null },
    { wardNumber: "80", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lindiwe Isabel Msomi", approved: false, residentEstimate: null },
    { wardNumber: "81", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thamisanqa Desmond Mthethwa", approved: false, residentEstimate: null },
    { wardNumber: "82", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sibusiso Blessing Cele", approved: false, residentEstimate: null },
    { wardNumber: "83", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bhekizazi Vincent Mngwengwe", approved: false, residentEstimate: null },
    { wardNumber: "84", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Msizi Enerst Mabaso", approved: false, residentEstimate: null },
    { wardNumber: "85", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sphelele Gabriel Nene", approved: false, residentEstimate: null },
    { wardNumber: "86", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sizwe Stanley Sandisele Mthethwa", approved: false, residentEstimate: null },
    { wardNumber: "87", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Brian Sizwe Bonginkosi Sindane", approved: false, residentEstimate: null },
    { wardNumber: "88", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thembinkosi Ziphozonke Mathe", approved: false, residentEstimate: null },
    { wardNumber: "89", municipalityId: "ethekwini", party: "Inkatha Freedom Party", regionName: "Area not yet listed", councillorName: "Mbangeni Bhekisisa Mjadu", approved: false, residentEstimate: null },
    { wardNumber: "90", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Dharmanand Rugbeer Nowbuth", approved: false, residentEstimate: null },
    { wardNumber: "91", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lungisani Conrad Sikakane", approved: false, residentEstimate: null },
    { wardNumber: "92", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Wonderboy Masoka Mazibuko", approved: false, residentEstimate: null },
    { wardNumber: "93", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thabisile Gloria Zungu", approved: false, residentEstimate: null },
    { wardNumber: "94", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nomvula Prudence Hlomuka", approved: false, residentEstimate: null },
    { wardNumber: "95", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thokozani Vivian Xulu", approved: false, residentEstimate: null },
    { wardNumber: "96", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thembelihle Goodhope Makhanya", approved: false, residentEstimate: null },
    { wardNumber: "97", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "André Beetge", approved: false, residentEstimate: null },
    { wardNumber: "98", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mfanafuthi Arthur Jokweni", approved: false, residentEstimate: null },
    { wardNumber: "99", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mnqobi Victor Molife", approved: false, residentEstimate: null },
    { wardNumber: "100", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mbuyiseni Percival Mkhize", approved: false, residentEstimate: null },
    { wardNumber: "101", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Simon Siyabonga Mkhize", approved: false, residentEstimate: null },
    { wardNumber: "102", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Rory Dean Macpherson", approved: false, residentEstimate: null },
    { wardNumber: "103", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Minenhle Calvin Mkhize", approved: false, residentEstimate: null },
    { wardNumber: "104", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkululeko Sizwe Ndlovu", approved: false, residentEstimate: null },
    { wardNumber: "105", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ayanda Brightman Ndlovu", approved: false, residentEstimate: null },
    { wardNumber: "106", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Johnson Chetty", approved: false, residentEstimate: null },
    { wardNumber: "107", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Njabulo Ntuli", approved: false, residentEstimate: null },
    { wardNumber: "108", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Falakhe Obrien Gcabashe", approved: false, residentEstimate: null },
    { wardNumber: "109", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Menzi Wilfred Manqele", approved: false, residentEstimate: null },
    { wardNumber: "110", municipalityId: "ethekwini", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Aamir Abdul", approved: false, residentEstimate: null },
    { wardNumber: "111", municipalityId: "ethekwini", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Innocent Mhlengi Shinga", approved: false, residentEstimate: null },
];

const MSUNDUZI_WARDS: WardListing[] = [
    { wardNumber: "1", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Khulekani Msomi", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "msunduzi", party: null, regionName: "Area not yet listed", councillorName: "Mbongeni Zuma", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Skhanyiso Cyril Makhaye", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Hamilton Mlungisi Zondi", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkosinathi Maxwell Mbanjwa", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Kwazikwakhe Emmanuel Madonda", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "msunduzi", party: "Independent", regionName: "Area not yet listed", councillorName: "Bukelani Ephram Zuma", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "msunduzi", party: "Inkatha Freedom Party", regionName: "Area not yet listed", councillorName: "Mshushisi Aubrey Ngubane", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nduduzi Caswell Mshengu", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Themba Cyril Ngubane", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sanele Russel Zuma", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkosinathi Patrick Masoeu", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Gladness Sibongile Mncwango", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sibusiso Alfred Mkhize", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Msawenkosi Bhengu", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Micheal Bhekabantu Zuma", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mphilisi Instance Ndlovu", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Simphiwe Samuel Buthelezi", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Percival Vusi Ngwenya", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Siphiwe Phungula", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sbongumusa Zuma", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thembinkosi Zondi", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Dumisani Bernard Phungula", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sinothi Jerome Nkabini", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "msunduzi", party: null, regionName: "Area not yet listed", councillorName: "Xolani Khanyile", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "msunduzi", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Ross Bryan Strachan", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "msunduzi", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Haroon Daniel Kemp", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "msunduzi", party: null, regionName: "Area not yet listed", councillorName: "Renisha Singh", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "msunduzi", party: null, regionName: "Area not yet listed", councillorName: "Sphamandla Sydney Madlala", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "msunduzi", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Rachel Soobiah", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "msunduzi", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Rooksana Ahmed", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "msunduzi", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Garth Frederick Wesley Middleton", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "msunduzi", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Suraya Reddy", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Roy Ram", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sandile Wellington Dlamini", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "msunduzi", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Douglas Leslie Roberts", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "msunduzi", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Edith Elliott", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Godman Nkosivelile Dlamini", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mbusiswa Hencefort Mkhize", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Jabulisile Joyce Ngubo", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "msunduzi", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mabhungu Moses Mkhize", approved: false, residentEstimate: null },
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
      municipalityId: "coj", party: "Democratic Alliance",
      regionName: "Fourways / Bloubosrand",
      councillorName: "Mark Van Der Merwe",
      approved: true,
      residentEstimate: "~6,500 residents",
    },
    { wardNumber: "1", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Msingathi Mazibukwana", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Dimakatso Jeannette Ramafikeng", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zacharia Mokoari", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Simon Butana Molefe", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Claud Mxolisi Ndzondo", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Peto Solly Phometsi", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Amelia Augusta Deborah Zama", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Molate Godfrey Lebea", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "coj", party: "Al Jama-ah", regionName: "Area not yet listed", councillorName: "Imraan Ismail-Moosa", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nokuthula Nofemela", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Masha Mulelu", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Olivia Teboho Moeti", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bawinile Landiwe Pamella Magwaza", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thomas Makapane Mokwena", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Shadrack Vusumuzi Ngema", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Gift Mathe", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "coj", party: "Patriotic Alliance", regionName: "Area not yet listed", councillorName: "Dwain Adin Ponsonby", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "coj", party: "Patriotic Alliance", regionName: "Area not yet listed", councillorName: "Juwairiya Kaldine", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Siphiwe Oscar Simelane", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lazarus Mmota", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mpho Isaac Sesedinyane", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sebenzile Kentina Laura Mabuza", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Tyrell Meyers", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zakhele Ephraim Mathe", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Cambridge Kwapeng", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sithembiso Mashinini", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Godfrey Jerry Tshehlo", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Peter Ndou", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Brenda Happy Dammie", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mohau Molefe", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bongani Dlamini", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Dimakatso Moloisane", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nompumelelo Mazibuko", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lucas Lefutso", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lineo Yvette Margaret Tsotetsi", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Johannes Mofokeng", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Hamilton Chetsanga", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Phindile Simelane", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lefa Daniel Molise", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tumelo Joseph Madiba", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lunga Xuma", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Luyolo Nkubungu", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Philemon Shumani Tambani", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Phineas Velaphi Tefu", approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Agnes Zazini", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Dumisani Steven Modladlaba", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tebogo Marcia Mhlari", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Galebotse Salamina Mpotulo", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mthuthuzeli Goodman Bolani", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bheki Mgaga", approved: false, residentEstimate: null },
    { wardNumber: "51", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Wilson Bhekukwenza Mngadi", approved: false, residentEstimate: null },
    { wardNumber: "52", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thapelo Thabani Radebe", approved: false, residentEstimate: null },
    { wardNumber: "53", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ntaoleng Mpho Mofokeng", approved: false, residentEstimate: null },
    { wardNumber: "54", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Stuart Iain Marais", approved: false, residentEstimate: null },
    { wardNumber: "55", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Rashieda Landis", approved: false, residentEstimate: null },
    { wardNumber: "56", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Michael Ian Crichton", approved: false, residentEstimate: null },
    { wardNumber: "57", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Faeeza Chame", approved: false, residentEstimate: null },
    { wardNumber: "58", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Rickey Kashore Nair", approved: false, residentEstimate: null },
    { wardNumber: "59", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ian Mzoxolo Nonkumbi", approved: false, residentEstimate: null },
    { wardNumber: "60", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sihle Nguse", approved: false, residentEstimate: null },
    { wardNumber: "61", municipalityId: "coj", party: "Inkatha Freedom Party", regionName: "Area not yet listed", councillorName: "Themba Mkhize", approved: false, residentEstimate: null },
    { wardNumber: "62", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zanele Philipine Nyembe", approved: false, residentEstimate: null },
    { wardNumber: "63", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Xolani Innocent Khumalo", approved: false, residentEstimate: null },
    { wardNumber: "64", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Boyboi Jack Sekwaila", approved: false, residentEstimate: null },
    { wardNumber: "65", municipalityId: "coj", party: "Inkatha Freedom Party", regionName: "Area not yet listed", councillorName: "Nkosikhona Maxwell Khanyile", approved: false, residentEstimate: null },
    { wardNumber: "66", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Carlos Manuel Dias Da Rocha", approved: false, residentEstimate: null },
    { wardNumber: "67", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "David Nthako Modupi", approved: false, residentEstimate: null },
    { wardNumber: "68", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Msimelelo Lobi", approved: false, residentEstimate: null },
    { wardNumber: "69", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Genevieve Joeline Sherman", approved: false, residentEstimate: null },
    { wardNumber: "70", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Caleb Edward Finn", approved: false, residentEstimate: null },
    { wardNumber: "71", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "René Fiona Benjamin", approved: false, residentEstimate: null },
    { wardNumber: "72", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Daniel Schay", approved: false, residentEstimate: null },
    { wardNumber: "73", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Eleanor Anne Huggett", approved: false, residentEstimate: null },
    { wardNumber: "74", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Belinda Cynthia Echeozonjoku", approved: false, residentEstimate: null },
    { wardNumber: "75", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Livhuwani Sannie Mavhona", approved: false, residentEstimate: null },
    { wardNumber: "76", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Olga Zandile Mothopi", approved: false, residentEstimate: null },
    { wardNumber: "77", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Yoliswa Agnes Twala", approved: false, residentEstimate: null },
    { wardNumber: "78", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Spiwe Stephen Makamo", approved: false, residentEstimate: null },
    { wardNumber: "79", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thompson Maluleka", approved: false, residentEstimate: null },
    { wardNumber: "80", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sebenzile Melody Hlatshwayo", approved: false, residentEstimate: null },
    { wardNumber: "81", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Joanne Horwitz", approved: false, residentEstimate: null },
    { wardNumber: "82", municipalityId: "coj", party: "Patriotic Alliance", regionName: "Area not yet listed", councillorName: "Beverley Marilyne Smouse", approved: false, residentEstimate: null },
    { wardNumber: "83", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Florence Cheryl Roberts", approved: false, residentEstimate: null },
    { wardNumber: "84", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Johannes Wilhelmus Goosen", approved: false, residentEstimate: null },
    { wardNumber: "85", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Zoné Niemand", approved: false, residentEstimate: null },
    { wardNumber: "86", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Chantelle Fourie-Shawe", approved: false, residentEstimate: null },
    { wardNumber: "87", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Bridget Steer", approved: false, residentEstimate: null },
    { wardNumber: "88", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Nicolene Jonker", approved: false, residentEstimate: null },
    { wardNumber: "89", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Leah Ruth Potgieter", approved: false, residentEstimate: null },
    { wardNumber: "90", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Martin Charles Williams", approved: false, residentEstimate: null },
    { wardNumber: "91", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Andrew John Stewart", approved: false, residentEstimate: null },
    { wardNumber: "92", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Charmaine S'Bongile Ngoepe", approved: false, residentEstimate: null },
    { wardNumber: "93", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Vinotharan Mogambaram Reddy", approved: false, residentEstimate: null },
    { wardNumber: "94", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "David Terence Foley", approved: false, residentEstimate: null },
    { wardNumber: "95", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Matome Julius Maake", approved: false, residentEstimate: null },
    { wardNumber: "96", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Rufas Maswazi", approved: false, residentEstimate: null },
    { wardNumber: "97", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Jacques Stephen Hoén", approved: false, residentEstimate: null },
    { wardNumber: "98", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Beverley Weweje", approved: false, residentEstimate: null },
    { wardNumber: "99", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Hendrik Bodenstein", approved: false, residentEstimate: null },
    { wardNumber: "100", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkhumeleni Lyborn Ndou", approved: false, residentEstimate: null },
    { wardNumber: "101", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Ralf Bittkau", approved: false, residentEstimate: null },
    { wardNumber: "102", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "David Douglas Wittmann-Potter", approved: false, residentEstimate: null },
    { wardNumber: "103", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Lynda Margaret Shackleford", approved: false, residentEstimate: null },
    { wardNumber: "104", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Marialett Koekemoer", approved: false, residentEstimate: null },
    { wardNumber: "105", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Albert Tefo Raphadu", approved: false, residentEstimate: null },
    { wardNumber: "106", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Christopher Glen Santana", approved: false, residentEstimate: null },
    { wardNumber: "107", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Floyd Nhlakanipho Ngwenya", approved: false, residentEstimate: null },
    { wardNumber: "108", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Deborah Busisiwe Francisco", approved: false, residentEstimate: null },
    { wardNumber: "109", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Lori Cynthia Coogan", approved: false, residentEstimate: null },
    { wardNumber: "110", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Maredi Angelinah Mphaho", approved: false, residentEstimate: null },
    { wardNumber: "111", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nontutuzela Prescilla Supe", approved: false, residentEstimate: null },
    { wardNumber: "112", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Lerato Magdeline Philiya Mphefo", approved: false, residentEstimate: null },
    { wardNumber: "113", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thambulo Abraham Mabuke", approved: false, residentEstimate: null },
    { wardNumber: "114", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tebogo David Mangena", approved: false, residentEstimate: null },
    { wardNumber: "116", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Vhonani Adolphus Marema", approved: false, residentEstimate: null },
    { wardNumber: "117", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Timothy Francis Truluck", approved: false, residentEstimate: null },
    { wardNumber: "118", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Neuren Pietersen", approved: false, residentEstimate: null },
    { wardNumber: "119", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lindani Thobile Zondo", approved: false, residentEstimate: null },
    { wardNumber: "120", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Celstina Nzimande", approved: false, residentEstimate: null },
    { wardNumber: "121", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Khazamula Love Chauke", approved: false, residentEstimate: null },
    { wardNumber: "122", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkosephayo God-Slove Zungu", approved: false, residentEstimate: null },
    { wardNumber: "123", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Maanda Norman Mmbengwa", approved: false, residentEstimate: null },
    { wardNumber: "124", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mongameli Mnyameni", approved: false, residentEstimate: null },
    { wardNumber: "125", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Matsobane Victor Sekhu", approved: false, residentEstimate: null },
    { wardNumber: "126", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "David Gerald Brand", approved: false, residentEstimate: null },
    { wardNumber: "127", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mboneni Clerence Tabane", approved: false, residentEstimate: null },
    { wardNumber: "128", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thebeyatumelo Macdonald Galeshewe", approved: false, residentEstimate: null },
    { wardNumber: "129", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Phumlile Alvina Shange", approved: false, residentEstimate: null },
    { wardNumber: "130", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thulani Colson Buthelezi", approved: false, residentEstimate: null },
    { wardNumber: "131", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Makhosazana Cynthia Ndlela", approved: false, residentEstimate: null },
    { wardNumber: "132", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Annette Janine Deppe", approved: false, residentEstimate: null },
    { wardNumber: "133", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Teboho Marumo", approved: false, residentEstimate: null },
    { wardNumber: "134", municipalityId: "coj", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Devon Steenkamp", approved: false, residentEstimate: null },
    { wardNumber: "135", municipalityId: "coj", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Fuyakomo Phelelani Sindani", approved: false, residentEstimate: null },
  ],
  coct: COCT_WARDS,
  ethekwini: ETHEKWINI_WARDS,
  tshwane: [
    { wardNumber: "1", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Leon Pieter Kruyshaar", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Quentin Meyer", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Malesela Phohlo John Rakabe", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Petrus Malope", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Albertus Martinus Van Niekerk", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mashiba Isaac Madonsela", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Molatelo Samuel Mashola", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Alfred Boas Matjeke", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Patricia Lerato Machava", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thabang Mabitse Masemola", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Fiki Zophonia Mashigo", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Donald Khotso Tsela", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nomfutshane Sonia Mabolawa", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lesibana Hans Mothoa", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Joel Kgomotso Masilela", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mmina-Tau Seabelo Marishane", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sylvia Paulina Lelaka", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Vusi Isaac Masemola", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Macalene Stanley Mazibuko", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Neo Tiragalo Mocumi", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ellen Phumzile Mbokane", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mamma Cathrine Mabaswa", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Diamond Hendrick Mashao", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Christopher Sikhumbuzo Masia", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Phindile Phinah Chiota", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thulang Joseph Shume", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bongani Mcdonald Masina", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nomvula Joyce Seelane", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Moses Thabo Mathibedi", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Violet Phalwane", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tshepo Floyd Kgatle", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Floyd Makete Thema", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lerato Marcia Aphane", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Rose Sisi Sethole", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tebogo Patrick Kholofelo Mashapa", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Veronica Palesa Modise", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zacharia Sekete Ntohla", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Saul Mokube Ratau", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Jan Japane Baloyi", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Maloke Joseph Makola", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Barend William Chapman", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Shane Maas", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Benjamin William Lawrence", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "tshwane", party: null, regionName: "Area not yet listed", councillorName: null, approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Elizabeth Maria Basson", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Pieter Willem Van Heerden", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Anna Alida Erasmus", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Thembamandla Elijah Fosi", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Matome Adam Mashapa", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Aletta Susanna Breytenbach", approved: false, residentEstimate: null },
    { wardNumber: "51", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sarah Salamina Moabelo", approved: false, residentEstimate: null },
    { wardNumber: "52", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Frans Johannes Smith", approved: false, residentEstimate: null },
    { wardNumber: "53", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Wayne Peter Helfrich", approved: false, residentEstimate: null },
    { wardNumber: "54", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Elma Johanna Nel", approved: false, residentEstimate: null },
    { wardNumber: "55", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Kwena Yvonne Dzumba", approved: false, residentEstimate: null },
    { wardNumber: "56", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Dippenaar Tiaan", approved: false, residentEstimate: null },
    { wardNumber: "57", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "David James Farquharson", approved: false, residentEstimate: null },
    { wardNumber: "58", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Conride Ngoveni", approved: false, residentEstimate: null },
    { wardNumber: "59", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Shaun Wilkinson", approved: false, residentEstimate: null },
    { wardNumber: "60", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mpati Isaac Ramphile", approved: false, residentEstimate: null },
    { wardNumber: "61", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Naeem Patel", approved: false, residentEstimate: null },
    { wardNumber: "62", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Esther Nonzingo Masuku", approved: false, residentEstimate: null },
    { wardNumber: "63", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Duduzile Elsa Majola", approved: false, residentEstimate: null },
    { wardNumber: "64", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Issabel Alta De Kock", approved: false, residentEstimate: null },
    { wardNumber: "65", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Gert Petrus Visser", approved: false, residentEstimate: null },
    { wardNumber: "66", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Catharina Elizabeth Strydom", approved: false, residentEstimate: null },
    { wardNumber: "67", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sizwe Paulos Clifton Tsiane", approved: false, residentEstimate: null },
    { wardNumber: "68", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tshililo Victor Rambau", approved: false, residentEstimate: null },
    { wardNumber: "69", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Cindy Billson", approved: false, residentEstimate: null },
    { wardNumber: "70", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Marika Elizabeth Kruger Muller", approved: false, residentEstimate: null },
    { wardNumber: "71", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mmakgoko Veron Phasha", approved: false, residentEstimate: null },
    { wardNumber: "72", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Abbiot Masopo Sebola", approved: false, residentEstimate: null },
    { wardNumber: "73", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Michael Ndlovu", approved: false, residentEstimate: null },
    { wardNumber: "74", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zacharea Setimo", approved: false, residentEstimate: null },
    { wardNumber: "75", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nthabiseng Mahlangu", approved: false, residentEstimate: null },
    { wardNumber: "76", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mavis Elizabeth Kekana", approved: false, residentEstimate: null },
    { wardNumber: "77", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tembeni Innocent Thabatha", approved: false, residentEstimate: null },
    { wardNumber: "78", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Peter Sutton", approved: false, residentEstimate: null },
    { wardNumber: "79", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Johan Gerhard Van Buuren", approved: false, residentEstimate: null },
    { wardNumber: "80", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sekokobale Fortune Mampuru", approved: false, residentEstimate: null },
    { wardNumber: "81", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mpho Hans Lewele", approved: false, residentEstimate: null },
    { wardNumber: "82", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Siobhan Muller", approved: false, residentEstimate: null },
    { wardNumber: "83", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Andrew Lesch", approved: false, residentEstimate: null },
    { wardNumber: "84", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Christopher Anru Meyer", approved: false, residentEstimate: null },
    { wardNumber: "85", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Jacqueline Uys", approved: false, residentEstimate: null },
    { wardNumber: "86", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Kholofelo Patience Kgopotso", approved: false, residentEstimate: null },
    { wardNumber: "87", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Christiaan Frederick Pienaar", approved: false, residentEstimate: null },
    { wardNumber: "88", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tshepang Sagious Boikanyo", approved: false, residentEstimate: null },
    { wardNumber: "89", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tshepo Patrick Malefane", approved: false, residentEstimate: null },
    { wardNumber: "90", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Enos Papiki Chiloane", approved: false, residentEstimate: null },
    { wardNumber: "91", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Henning Johannes Viljoen", approved: false, residentEstimate: null },
    { wardNumber: "92", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Shimmy Nathaniel Mashamaite", approved: false, residentEstimate: null },
    { wardNumber: "93", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nathaniel Rabasotho Masupha", approved: false, residentEstimate: null },
    { wardNumber: "94", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Manakedi Elisa Mlotshwa", approved: false, residentEstimate: null },
    { wardNumber: "95", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "William Nkholo Kgopa", approved: false, residentEstimate: null },
    { wardNumber: "96", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Gé Andries Breytenbach", approved: false, residentEstimate: null },
    { wardNumber: "97", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkoata Ananias Mokgalotsi", approved: false, residentEstimate: null },
    { wardNumber: "98", municipalityId: "tshwane", party: null, regionName: "Area not yet listed", councillorName: null, approved: false, residentEstimate: null },
    { wardNumber: "99", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Silias Mothupi Makena", approved: false, residentEstimate: null },
    { wardNumber: "100", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Johannes Christoffel Bekker", approved: false, residentEstimate: null },
    { wardNumber: "101", municipalityId: "tshwane", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Malcolm Ian De Klerk", approved: false, residentEstimate: null },
    { wardNumber: "102", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Vusi Ephraim Mabena", approved: false, residentEstimate: null },
    { wardNumber: "103", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Eunice Dineo Moloi", approved: false, residentEstimate: null },
    { wardNumber: "104", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Oupa Patrick Matshiane", approved: false, residentEstimate: null },
    { wardNumber: "105", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Kgaugelo Stephans Phiri", approved: false, residentEstimate: null },
    { wardNumber: "106", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mogauwane Kenneth Masha", approved: false, residentEstimate: null },
    { wardNumber: "107", municipalityId: "tshwane", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Phasudi Jeffrey Mashego", approved: false, residentEstimate: null },
  ],
  ekurhuleni: [
    { wardNumber: "1", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Derek Edwin Thomson", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mashiane Thato S.G", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Machete Kedibone Yvonne", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mbathane Daniel", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Kgafela Malesela Francis", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tleane Patric Abisang", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Jiyane Thabang Asaph", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ntshingila Nhlanhla Lucky", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Malinga Nomvula", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Petlele Pusetso", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thoabala Legala Oriel", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ndinisa Gloria M.", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ngqwangi Bulelwa P.", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mnguni Adelaide Lindiwe", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Davison Amanda", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Terblanche Hendrik Jacobus", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Lapping Simon James", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Hart Heather Dawn", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "R.", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Humphreys Jill Ada", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mudau Martha Mashudu", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Muller Madelaine Elizabeth", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Goslin Gerald", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Da Silva Nicola Brigitte", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Beukes Marinda", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mathole Thamaga Wa Ga-Mathole", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Joseph Lornette Jayne", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Goby Mary Elizabeth", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Loonat Imitiaz Ahmed", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ranyawo Kenny Daniel", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Sabe Simangele Evelyn", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "De Vos Marius Nico", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Hoods Ashley Ronald", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "ekurhuleni", party: "Patriotic Alliance", regionName: "Area not yet listed", councillorName: "Klassen Kathrine Edith", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mpambani Ntuthuzelo", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Morgan Wendy Bridgette", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Naidoo Ivan", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Maifala Malcom Tau", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Ingram Maureen Jean", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Tshabalala Nqabayethu L.", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Hlongwane Sanele", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Motloung Tsotang Princece", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Marais Carolana", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Shongwe Nkosinathi B.", approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sidu Nkululeko", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Quntana Thunyiswa Kwame", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkosi Reginah Thandi", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Dube Mfana", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ramafikeng Frans Lekgotla", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ngwenya Vuyani", approved: false, residentEstimate: null },
    { wardNumber: "51", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Poki Tinstwalo Lumka", approved: false, residentEstimate: null },
    { wardNumber: "52", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Dlamini Sibusiso Promise", approved: false, residentEstimate: null },
    { wardNumber: "53", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mketsu Mziyanda", approved: false, residentEstimate: null },
    { wardNumber: "54", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thupa Thabo Xerxes", approved: false, residentEstimate: null },
    { wardNumber: "55", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zikode Lucky Simon", approved: false, residentEstimate: null },
    { wardNumber: "56", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Radebe Fanifani Moses", approved: false, residentEstimate: null },
    { wardNumber: "57", municipalityId: "ekurhuleni", party: "Patriotic Alliance", regionName: "Area not yet listed", councillorName: "Peterson Dino", approved: false, residentEstimate: null },
    { wardNumber: "58", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Fodo Mfundiso", approved: false, residentEstimate: null },
    { wardNumber: "59", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Msimango Khumbuzile P.", approved: false, residentEstimate: null },
    { wardNumber: "60", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Qwema Princess Phindiwe", approved: false, residentEstimate: null },
    { wardNumber: "61", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ngubane Sanele Cromwell", approved: false, residentEstimate: null },
    { wardNumber: "62", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Letsoela Thabiso", approved: false, residentEstimate: null },
    { wardNumber: "63", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Kiyane Nomonde Cynthia", approved: false, residentEstimate: null },
    { wardNumber: "64", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Motsopi Thekiso Amos", approved: false, residentEstimate: null },
    { wardNumber: "65", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Moloi Siyabonga Matthews", approved: false, residentEstimate: null },
    { wardNumber: "66", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Khumalo Samuel Mzwakhe", approved: false, residentEstimate: null },
    { wardNumber: "67", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Moimana Jerry Leshalabe", approved: false, residentEstimate: null },
    { wardNumber: "68", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mbeki Vuyani Welcome", approved: false, residentEstimate: null },
    { wardNumber: "69", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Radebe Mpho Gift", approved: false, residentEstimate: null },
    { wardNumber: "70", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ndlovu Sibongiseni R.", approved: false, residentEstimate: null },
    { wardNumber: "71", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lubisi Thembinkosi C.", approved: false, residentEstimate: null },
    { wardNumber: "72", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Stone Dean Desmond", approved: false, residentEstimate: null },
    { wardNumber: "73", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ngobese Samuel Sipho", approved: false, residentEstimate: null },
    { wardNumber: "74", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Simelane David Thulani", approved: false, residentEstimate: null },
    { wardNumber: "75", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Kock Charmaine Patricia", approved: false, residentEstimate: null },
    { wardNumber: "76", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Du Toit Michael Duncan", approved: false, residentEstimate: null },
    { wardNumber: "77", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Dunjana Thulani Xolani", approved: false, residentEstimate: null },
    { wardNumber: "78", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nhleko Sizwe Enock", approved: false, residentEstimate: null },
    { wardNumber: "79", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mbonani Njabulo Ronald", approved: false, residentEstimate: null },
    { wardNumber: "80", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkosi-Ramothebe Sarah C.", approved: false, residentEstimate: null },
    { wardNumber: "81", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bulala Standley Jeremia", approved: false, residentEstimate: null },
    { wardNumber: "82", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Buitendacht Henry C.", approved: false, residentEstimate: null },
    { wardNumber: "83", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Pike Slindokuhle", approved: false, residentEstimate: null },
    { wardNumber: "84", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mthiyane Phikisile E.", approved: false, residentEstimate: null },
    { wardNumber: "85", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sibiya Moses Sipho", approved: false, residentEstimate: null },
    { wardNumber: "86", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mekgwe Nkgopotse Nsizwa", approved: false, residentEstimate: null },
    { wardNumber: "87", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Hlophe Simon Bongani", approved: false, residentEstimate: null },
    { wardNumber: "88", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Labuschagne Wollaston", approved: false, residentEstimate: null },
    { wardNumber: "89", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Pudi Tshoarelo", approved: false, residentEstimate: null },
    { wardNumber: "90", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Selwana Hendrick Ntate", approved: false, residentEstimate: null },
    { wardNumber: "91", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Mckenzie Desmond A.", approved: false, residentEstimate: null },
    { wardNumber: "92", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Guerreiro Kade Ricci", approved: false, residentEstimate: null },
    { wardNumber: "93", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mthembu Geoffrey Isaac", approved: false, residentEstimate: null },
    { wardNumber: "94", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Nair Samantha", approved: false, residentEstimate: null },
    { wardNumber: "95", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Madlala Khehla Phillip", approved: false, residentEstimate: null },
    { wardNumber: "96", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mashala Stenias Ranias", approved: false, residentEstimate: null },
    { wardNumber: "97", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Pretorius Brandon", approved: false, residentEstimate: null },
    { wardNumber: "98", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Motaung Tefo Patrick", approved: false, residentEstimate: null },
    { wardNumber: "99", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Daemane Petrus Andile", approved: false, residentEstimate: null },
    { wardNumber: "100", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Khotha Bennet Mluleki", approved: false, residentEstimate: null },
    { wardNumber: "101", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ngwenya Mzayifani R.", approved: false, residentEstimate: null },
    { wardNumber: "102", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mabye Madimetja Solomon", approved: false, residentEstimate: null },
    { wardNumber: "103", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Madi Lillian Ntombikayise", approved: false, residentEstimate: null },
    { wardNumber: "104", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Lourenco Tracey", approved: false, residentEstimate: null },
    { wardNumber: "105", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Verster Antoinette E.", approved: false, residentEstimate: null },
    { wardNumber: "106", municipalityId: "ekurhuleni", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Denny Timothy Mark", approved: false, residentEstimate: null },
    { wardNumber: "107", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Goje Thabani Moses", approved: false, residentEstimate: null },
    { wardNumber: "108", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thobejane Phatudi Alex M.", approved: false, residentEstimate: null },
    { wardNumber: "109", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Shabalala Mzomuhle Lucas", approved: false, residentEstimate: null },
    { wardNumber: "110", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mnisi Sarah Lebogang", approved: false, residentEstimate: null },
    { wardNumber: "111", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mabhe Zingisile", approved: false, residentEstimate: null },
    { wardNumber: "112", municipalityId: "ekurhuleni", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mnguni Nomalanga Annah", approved: false, residentEstimate: null },
  ],
  "nelson-mandela-bay": [
    { wardNumber: "1", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "André Van Der Westhuizen", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: null, approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "David Alan Hayselden", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nozuko Mavis Mbambo", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Terri Stander", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Gerhardus Johannes Scheepers Engelbrecht", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Brendon Stephen Pegram", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Gustav Rautenbach", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Heinrich Müller", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Gnanasagaran Moodley", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Graham Hilton Gelderbloem", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Verwon Nolan Boggenpoel", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Ingrid Leslie Van Wyk", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mbulelo Braveman Qupe", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mpumelelo Julius Majola", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ruth Kuselwa Ngxenge", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ludwe Brian Mnyandu", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nkululeko Makhwenkwe", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Gamalihleli Develop Maqula", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Wellington Zwelandile Booi", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Siyamcela Nicholus Mlangazi", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Monwabisi Richard Jakuja", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nosithembiso Mayekiso", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Xolile Mike Vinqi", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Anele Henderson Bell", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Patrick Buyisile Vani", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sicelo Mleve", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Luzuko Peter", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Benjamin Nomnqa", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Xolani Lennox Notshe", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Leetesline Alphonso Booysen", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Pieter Hermaans", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bidwell Mzwandile Sidina", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Johnny Alridge Arends", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Noline Rose Moodley", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Khanyisa Arthur Mani", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Tyrone Peter Adams", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mphumzi Patrick Momo", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Magrieta Johanna Du Toit", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Jason Grobbelaar", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Luyanda Niebeck Lawu", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lulama Ngwane", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Andile Austin Andries", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Luzuko Ndamse", approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Sabelo Mcdonald Mabuda", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Ntobeko Ebem Nqakula", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lungile Zacharia Longbooi", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Franay Anne Van De Linde", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Georgen Gastuv Miggels", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Nomxolisi Phezisa", approved: false, residentEstimate: null },
    { wardNumber: "51", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Roelof David Basson", approved: false, residentEstimate: null },
    { wardNumber: "52", municipalityId: "nelson-mandela-bay", party: "Democratic Alliance", regionName: "Area not yet listed", councillorName: "Ernest Francois Swanepoel", approved: false, residentEstimate: null },
    { wardNumber: "53", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Zwelandile Patrick Tsotso", approved: false, residentEstimate: null },
    { wardNumber: "54", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lunga Minyayo", approved: false, residentEstimate: null },
    { wardNumber: "55", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Patrick Tanduxolo Doda", approved: false, residentEstimate: null },
    { wardNumber: "56", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Lubabalo Rydwell Ludwabe", approved: false, residentEstimate: null },
    { wardNumber: "57", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thembinkosi Maswana", approved: false, residentEstimate: null },
    { wardNumber: "58", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Mendiswa Lucia Makunga", approved: false, residentEstimate: null },
    { wardNumber: "59", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Bulelani Matenjwa", approved: false, residentEstimate: null },
    { wardNumber: "60", municipalityId: "nelson-mandela-bay", party: "African National Congress", regionName: "Area not yet listed", councillorName: "Thembinkosi Bethwell Mafana", approved: false, residentEstimate: null },
  ],
  "buffalo-city": [
    { wardNumber: "1", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Braelyn Hills and Heights / Milner Estate / Stoneydrift / Milner Lennock and Panmure (+35 more)", councillorName: "Kuhle Ciliza", approved: false, residentEstimate: null },
    { wardNumber: "2", municipalityId: "buffalo-city", party: "African National Congress", regionName: "C Section 13 / Endlovini Area / Hostel B / Dunga (+10 more)", councillorName: "Akhona Dywili", approved: false, residentEstimate: null },
    { wardNumber: "3", municipalityId: "buffalo-city", party: "Democratic Alliance", regionName: "Southernwood / North End / Belgravia / Garmur Palace (+1 more)", councillorName: "Lorna Hali", approved: false, residentEstimate: null },
    { wardNumber: "4", municipalityId: "buffalo-city", party: "Democratic Alliance", regionName: "Selborne / Highgate / Cambridge West / Cambridge Town (+3 more)", councillorName: "Allister Lemarc Stewart", approved: false, residentEstimate: null },
    { wardNumber: "5", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Mzonyana Water Works / Ndancama / Ekuthuleni Squatter Camp / Haven Hills S-Road area (+1 more)", councillorName: "Monica Goci", approved: false, residentEstimate: null },
    { wardNumber: "6", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Parkridge / CC Lloyd Duncan Village / Moscow / Ford 6A & Up & Msimango Jiba Limba (+5 more)", councillorName: "Lukhanyiso Mzekeli", approved: false, residentEstimate: null },
    { wardNumber: "7", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Duncan Village / C Section / D Section / Dangazele (+13 more)", councillorName: "Mkakutta Clara Yekiso-morolong", approved: false, residentEstimate: null },
    { wardNumber: "8", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Fynbos All Areas / Gompo / Duncan Village / Momoti (+14 more)", councillorName: "Kwanele Majeke", approved: false, residentEstimate: null },
    { wardNumber: "9", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Amalinda / Braelyn / Extensions 8 & 10 / Thornbush Amalinda (+6 more)", councillorName: "Mendi Wetsetse", approved: false, residentEstimate: null },
    { wardNumber: "10", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Vergenoeg / Egoli / East Bank / Haven Hills South (+4 more)", councillorName: "Pearl Hanse", approved: false, residentEstimate: null },
    { wardNumber: "11", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Mdantsane NU-3A / Thembalethu East Industrial", councillorName: "Nozuko Claudia Stemela", approved: false, residentEstimate: null },
    { wardNumber: "12", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Smiling Valley / Nahoon Dam / Eureka", councillorName: "Andile Phethani", approved: false, residentEstimate: null },
    { wardNumber: "13", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Reeston / Biko Village / Thembalethu / Dice (+3 more)", councillorName: "Oscar Mhlauli", approved: false, residentEstimate: null },
    { wardNumber: "14", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Nokwe", councillorName: "Zininzi Mtyingizane", approved: false, residentEstimate: null },
    { wardNumber: "15", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Ducats / Nompumelelo / Abbortsford / Dorchester", councillorName: "Nwabisa Mcwabeni", approved: false, residentEstimate: null },
    { wardNumber: "16", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Winchester Gardens / Highway Gardens / Morningside / Cambridge location (+1 more)", councillorName: "Ntsika Qali", approved: false, residentEstimate: null },
    { wardNumber: "17", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Sandisiwe eluxolweni", councillorName: "Veliswa Angelina Mrwebi", approved: false, residentEstimate: null },
    { wardNumber: "18", municipalityId: "buffalo-city", party: "Democratic Alliance", regionName: "Vincent / Bunkers Hill / Nahoon Beach / Bonnie Doon (+1 more)", councillorName: "Jason Scott Mcdowell", approved: false, residentEstimate: null },
    { wardNumber: "19", municipalityId: "buffalo-city", party: "Democratic Alliance", regionName: "Green Fields / West Bank / Buffalo Flats / Woodrook (+3 more)", councillorName: "Shandre Marilyn Hoffman", approved: false, residentEstimate: null },
    { wardNumber: "20", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Mdantsane / zone 7", councillorName: "Aphiwe Gcwabe", approved: false, residentEstimate: null },
    { wardNumber: "21", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Riverine", councillorName: "Nkosinathi Mndi", approved: false, residentEstimate: null },
    { wardNumber: "22", municipalityId: "buffalo-city", party: "African National Congress", regionName: "KwaNdayi / Luxhomo / Mabeleni / Zone 17 Postdam (+5 more)", councillorName: "Sabelo Booi", approved: false, residentEstimate: null },
    { wardNumber: "23", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Mdantsane / Zone 14", councillorName: "Sibongile Gulwa", approved: false, residentEstimate: null },
    { wardNumber: "24", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Potsdam East / Potsdam South / Potsdam North Mdantsane NU 15 / Thambo Park (+4 more)", councillorName: "Melisizwe Tutu", approved: false, residentEstimate: null },
    { wardNumber: "25", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Phakamisa Township Zwelitsha Zone 8 / Cliff Location", councillorName: "Cynthia Mxabanisi-gakrishe", approved: false, residentEstimate: null },
    { wardNumber: "26", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Newlands / Mcleant Town / Thormpark / Postdam East (+6 more)", councillorName: "Monde Mfene", approved: false, residentEstimate: null },
    { wardNumber: "27", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Mzamomhle / Gonubie North & West / Gonubie North / Quenera (+1 more)", councillorName: "Boy-Boy Kalani", approved: false, residentEstimate: null },
    { wardNumber: "28", municipalityId: "buffalo-city", party: "Democratic Alliance", regionName: "Beacon Bay North / Beaconhurst / Blue Bend / Bonza Bay", councillorName: "Frederick Carel Pohl", approved: false, residentEstimate: null },
    { wardNumber: "29", municipalityId: "buffalo-city", party: "Democratic Alliance", regionName: "Gonubie Broads / Gonubie East / Eastwood HO / Gonubie North", councillorName: "Valerie Dawn Knoetze", approved: false, residentEstimate: null },
    { wardNumber: "30", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Mdantsane NU9 / Cuba / Manyano / Thembelihle (+1 more)", councillorName: "Nontyilelo Whittington", approved: false, residentEstimate: null },
    { wardNumber: "31", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Silverdale / Boxwood / Rocklands C / Kidds Beach and Hillandale (+10 more)", councillorName: "Bonisile Bangani Kidds", approved: false, residentEstimate: null },
    { wardNumber: "32", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Tsholomnqa Village / Kaysers Beach / Ncerha Village 4-7 / Christmas Rock (+2 more)", councillorName: "Ntombekhaya Sabana", approved: false, residentEstimate: null },
    { wardNumber: "33", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Needs Camp / Kini 1&2 / Cwecweni / Quru Hill (+13 more)", councillorName: "Mluleki David Thomas", approved: false, residentEstimate: null },
    { wardNumber: "34", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Dimbaza Township Central / Polar Park / Tembisa", councillorName: "Mayihlome Mcako", approved: false, residentEstimate: null },
    { wardNumber: "35", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Balasi Location / Balasi Valley / Zinyoka / Mortel Park (+9 more)", councillorName: "Simbongile Phandliwe", approved: false, residentEstimate: null },
    { wardNumber: "36", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Dimbaza / Pirie Trust / Pirie Mission / Khayelitsha (+10 more)", councillorName: "Bongiwe Sauli", approved: false, residentEstimate: null },
    { wardNumber: "37", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Westbank / Clubview / Mxaxo B / Tolofiyeni (+2 more)", councillorName: "Ntombekhaya M. Ntshebe", approved: false, residentEstimate: null },
    { wardNumber: "38", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Lower Mngqesha / Handsmission / Noncampa / Mzantsi (+12 more)", councillorName: "Ntombomzi L. Kese-ndotyi", approved: false, residentEstimate: null },
    { wardNumber: "39", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Schornville / Rhayi / Ginsberg / Bonke (+2 more)", councillorName: "Lunga Gqola", approved: false, residentEstimate: null },
    { wardNumber: "40", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Fort Murray / Qongotha / Godidi / Dubu (+10 more)", councillorName: "Kholiwe Thelma Faku", approved: false, residentEstimate: null },
    { wardNumber: "41", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Zwelitsha Zone", councillorName: "Sindiswa Skepe", approved: false, residentEstimate: null },
    { wardNumber: "42", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Mdantsane NU-1 & 2 / Slovo Park", councillorName: "Phakamile Bamla", approved: false, residentEstimate: null },
    { wardNumber: "43", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Tyutyu / Bisho / Peelton / Clubview", councillorName: "Dumisani Mahanjana", approved: false, residentEstimate: null },
    { wardNumber: "44", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Breidbach / Tshatshu / Sweetwaters Golf Course / Qalashe (+1 more)", councillorName: "Daniso Mwezi", approved: false, residentEstimate: null },
    { wardNumber: "45", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Litha / Skobeni / Berlin Tshabo 1 / Nkqonkqweni (+1 more)", councillorName: "Thulani Tempi", approved: false, residentEstimate: null },
    { wardNumber: "46", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Coveridge / Orange Grove / Rosemount / Sunnyride (+8 more)", councillorName: "Nceba Wiseman Kilimani", approved: false, residentEstimate: null },
    { wardNumber: "47", municipalityId: "buffalo-city", party: "Democratic Alliance", regionName: "Quigney / Central / North End / East Bank Squatter Kamp (+1 more)", councillorName: "Funeka Wolose", approved: false, residentEstimate: null },
    { wardNumber: "48", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Mdantsane NU-8 Lilian Ngoyi / Francis Nell / Sihlangene Park / Gomomo (+4 more)", councillorName: "Phumezo Jaxa", approved: false, residentEstimate: null },
    { wardNumber: "49", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Thubalethu / Ekuphumleni / Gesini / Masijongane (+11 more)", councillorName: "Ayanda Nkala", approved: false, residentEstimate: null },
    { wardNumber: "50", municipalityId: "buffalo-city", party: "African National Congress", regionName: "Kwelerha / Zozo / Tuba / Jongilanga (+2 more)", councillorName: "Anele Gunyazile", approved: false, residentEstimate: null },
  ],
  mangaung: MANGAUNG_WARDS,
  msunduzi: MSUNDUZI_WARDS,
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
