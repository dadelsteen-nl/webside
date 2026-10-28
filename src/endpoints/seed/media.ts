/**
 * Real imbody product and journal photos (shared Cloudinary account `depjdtrdf`), fetched while seeding.
 * Keys are product / post slugs; the first image of a product is its main and meta image.
 */
const CLD = 'https://res.cloudinary.com/depjdtrdf/image/upload'

export type SeedImage = { url: string; name: string; alt: { nl: string; en: string } }

const cld = (id: string, name: string, nl: string, en: string, png = false): SeedImage => ({
  alt: { en, nl },
  name: `${name}.${png ? 'png' : 'jpg'}`,
  url: `${CLD}/${png ? 'f_png' : 'f_jpg,q_85'},w_2000/${id}`,
})

export const productImages: Record<string, SeedImage[]> = {
  'imbody-pro-s': [
    cld('v1773845964/IMBODY_Vooraanzicht_ytlqfx.png', 'imbody-pro-s-vooraanzicht', 'imbody Pro S, vooraanzicht', 'imbody Pro S, front view', true),
    cld('v1773850624/IMBODY_Met_alle_accessoires_by99lz.avif', 'imbody-pro-s-met-accessoires', 'imbody Pro S met alle accessoires', 'imbody Pro S with all accessories'),
    cld('v1774041056/ChatGPT_Image_24_feb_2026_15_40_31_edited_zrx2dd.jpg', 'imbody-pro-s-woonkamer', 'imbody Pro S in een lichte woonkamer', 'imbody Pro S in a bright living room'),
    cld('v1774043013/IMBODY_touchscreen_yskhjp.jpg', 'imbody-pro-s-touchscreen', 'Trainen met live statistieken op de spiegel', 'Training with live stats on the mirror'),
    cld('v1774042184/IMBODY_Pro_S_Smart_gym_in_kleine_appartement_nneo3m.jpg', 'imbody-pro-s-appartement', 'imbody Pro S in een compact appartement', 'imbody Pro S in a compact apartment'),
    cld('v1773856916/IMBODY_Detail_armen_c5cqyv.png', 'imbody-pro-s-kabelarmen', 'Detail van de kabelarmen', 'Detail of the cable arms', true),
    cld('v1773856918/Resitance_hnm6ky.jpg', 'imbody-pro-s-weerstand', 'Digitale weerstand instellen', 'Setting the digital resistance'),
    cld('v1789399032/616f651a-77a1-4d0b-abdb-8f31e805f82e_milqlr.webp', 'imbody-pro-s-accessoires', 'Alle meegeleverde accessoires', 'All included accessories'),
  ],
  'lichaamssamenstelling-weegschaal': [
    cld('v1780163559/Weegschaal_ktbe6y.webp', 'weegschaal', 'Slimme weegschaal', 'Body composition scale'),
    cld('v1780163558/Weegschaal_4_idqbpz.webp', 'weegschaal-boven', 'Slimme weegschaal, bovenaanzicht', 'Body composition scale, top view'),
    cld('v1780163559/Weegschaal_6_zykyon.webp', 'weegschaal-onder', 'Slimme weegschaal, onderkant', 'Body composition scale, underside'),
  ],
  'smart-clips': [
    cld('v1780163558/Upgraded_clips_xenzdm.avif', 'smart-clips', 'Smart clips', 'Smart clips'),
    cld('v1780163533/Upgraded_clips_3_lcavfh.avif', 'smart-clips-gebruik', 'Smart clips in gebruik', 'Smart clips in use'),
  ],
  'ski-handgrepen': [
    cld('v1780163451/Ski_hendels_dvms3r.jpg', 'ski-handgrepen', 'Ski-handgrepen', 'Ski handles'),
    cld('v1780163451/Ski_hendels_2_jxvg5m.jpg', 'ski-handgrepen-gebruik', 'Ski-handgrepen in gebruik', 'Ski handles in use'),
  ],
  'slimme-meetlint': [
    cld('v1780163514/Slimme_Meetlint_ktulsz.webp', 'slim-meetlint', 'Slim meetlint', 'Smart measuring tape'),
    cld('v1780163451/Slimme_Meetlint_2_i55zel.webp', 'slim-meetlint-2', 'Slim meetlint, meetpunten', 'Smart measuring tape, measuring points'),
    cld('v1780163486/Slimme_Meetlint_4_rivnwd.webp', 'slim-meetlint-3', 'Slim meetlint, details', 'Smart measuring tape, details'),
    cld('v1780163500/Slimme_Meetlint_6_wexegr.webp', 'slim-meetlint-4', 'Slim meetlint met app', 'Smart measuring tape with app'),
  ],
  'pilates-lussen': [
    {
      alt: { en: 'Pilates loops', nl: 'Pilates-lussen' },
      name: 'pilates-lussen.jpg',
      url: 'https://cdn.shopify.com/s/files/1/0781/9414/7385/files/20261012174750_68_123.jpg?v=1791798597',
    },
  ],
}

export const postImages: Record<string, SeedImage> = {
  'herstel-en-mobiliteit': cld('v1773856922/imbody-begeleiding_tquqpc.jpg', 'journal-herstel', 'Begeleide oefening voor de spiegel', 'Guided exercise in front of the mirror'),
  'krachttraining-thuis-beginnen': cld('v1774043013/IMBODY_Personal_training_ppqjhb.jpg', 'journal-krachttraining', 'Personal trainer begeleidt een sessie op imbody', 'A personal trainer guiding a session on imbody'),
  'thuisgym-in-je-interieur': cld('v1773850614/dfe424_71bdf902cd5c438a954b531010fdced6_mv2_to0ila.jpg', 'journal-interieur', 'imbody Pro S naast de bank', 'imbody Pro S next to the sofa'),
}
