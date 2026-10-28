/**
 * imbody brand photography and video, hosted on the Dadelsteen Cloudinary account.
 * Used as defaults wherever the CMS has no media of its own yet.
 */

const BASE = 'https://res.cloudinary.com/depjdtrdf'

export type BrandAsset = {
  url: string
  alt: string
  width: number
  height: number
  mimeType?: string
}

/** Delivery URL capped at `w` pixels wide; Cloudinary picks format and quality. */
export const cld = (id: string, w = 2000) => `${BASE}/image/upload/q_auto,f_auto,w_${w}/${id}`

const img = (id: string, alt: string, width: number, height: number, w = 2000): BrandAsset => ({
  alt,
  height,
  mimeType: id.endsWith('.png') ? 'image/png' : 'image/jpeg',
  url: cld(id, w),
  width,
})

export const brandVideo = {
  hero: {
    alt: 'imbody Pro S in gebruik',
    mimeType: 'video/mp4',
    url: `${BASE}/video/upload/q_auto,vc_h264,w_1280/v1773843428/IMBODY_hero_video_1080p_vt3ggf.mp4`,
  },
  heroPoster: img('v1773843885/IMBODY_hero_video_loader_eg6vvd.jpg', 'imbody Pro S in gebruik', 1920, 1080),
}

export const brand = {
  /** Product cut-outs */
  front: img('v1773845964/IMBODY_Vooraanzicht_ytlqfx.png', 'imbody Pro S, vooraanzicht', 1280, 2276, 1280),
  withAccessories: img('v1773850624/IMBODY_Met_alle_accessoires_by99lz.avif', 'imbody Pro S met alle accessoires', 1600, 1600),
  accessoriesFlatlay: img('v1789399032/616f651a-77a1-4d0b-abdb-8f31e805f82e_milqlr.webp', 'Alle accessoires van de imbody Pro S', 1600, 1600),
  armsDetail: img('v1773856916/IMBODY_Detail_armen_c5cqyv.png', 'Detail van de kabelarmen', 1600, 1600),

  /** Interiors */
  livingRoom: img('v1774041056/ChatGPT_Image_24_feb_2026_15_40_31_edited_zrx2dd.jpg', 'imbody Pro S in een lichte woonkamer', 1600, 1200),
  apartment: img('v1774042184/IMBODY_Pro_S_Smart_gym_in_kleine_appartement_nneo3m.jpg', 'imbody Pro S in een compact appartement', 1600, 1200),
  modernLounge: img('v1773850614/dfe424_71bdf902cd5c438a954b531010fdced6_mv2_to0ila.jpg', 'imbody Pro S naast de bank', 1920, 1280),
  studio: img('v1774041394/Gemini_Generated_Image_iuitaoiuitaoiuit_edited_1_nfdj2d.jpg', 'imbody Pro S in een trainingsstudio', 1600, 1200),
  minimalRoom: img('v1774040972/kv%E5%9B%BE_2_ccyrsu.avif', 'Opgeklapte imbody Pro S in een minimalistische ruimte', 1600, 1200),
  floorInstall: img('v1773856975/IMBODY_vloerinstallatie_dpnewd.jpg', 'imbody Pro S met vloerinstallatie', 1200, 1600),

  /** People training */
  mirrorCoach: img('v1774043013/IMBODY_touchscreen_yskhjp.jpg', 'Trainen met live statistieken op de spiegel', 1200, 1600),
  stretch: img('v1773856922/imbody-begeleiding_tquqpc.jpg', 'Begeleide oefening voor de spiegel', 1200, 1600),
  barRow: img('v1776715012/%D7%9B%D7%A9%D7%97%D7%93%D7%A9%D7%A0%D7%95%D7%AA_%D7%A4%D7%95%D7%92%D7%A9%D7%AA_%D7%94%D7%AA%D7%9E%D7%93%D7%94_%D7%94%D7%AA%D7%95%D7%A6%D7%90%D7%94_%D7%94%D7%99%D7%90_%D7%90%D7%99%D7%9E%D7%95%D7%9F_%D7%A9%D7%9C%D7%90_%D7%93%D7%95%D7%9E%D7%94_%D7%9C%D7%A9%D7%95%D7%9D_%D7%93%D7%91%D7%A8_%D7%A9%D7%94%D7%9B%D7%A8%D7%AA%D7%9D.IMBODY_%D7%9E%D7%91%D7%99%D7%90_%D7%90%D7%AA_%D7%94%D7%A2%D7%AA%D7%99%D7%93_%D7%90%D7%9C_%D7%AA%D7%95%D7%9A_%D7%A9%D7%92%D7%A8%D7%AA_zdgfue.jpg', 'Roeien met de stang aan de kabelarmen', 1200, 1600),
  duo: img('v1776715502/%D7%9B%D7%9B%D7%94_%D7%A0%D7%A8%D7%90%D7%94_%D7%92%D7%91_%D7%A9%D7%9C_%D7%9E%D7%99%D7%A9%D7%94%D7%99_%D7%A9%D7%9C%D7%90_%D7%9E%D7%97%D7%A4%D7%A9%D7%AA_%D7%AA%D7%99%D7%A8%D7%95%D7%A6%D7%99%D7%9D_%D7%95%D7%9B%D7%A9%D7%94%D7%99%D7%90_%D7%9E%D7%AA%D7%90%D7%9E%D7%A0%D7%AA_%D7%A2%D7%9D_%D7%97%D7%91%D7%A8%D7%94_%D7%94%D7%9E%D7%95%D7%98%D7%99%D7%91%D7%A6%D7%99%D7%94_%D7%91%D7%A9%D7%9E%D7%99%D7%99%D7%9D_POWER_S_PRO_%D7%9E%D7%90_sfokww.jpg', 'Samen trainen met de imbody Pro S', 1600, 1200),
  personalTraining: img('v1774043013/IMBODY_Personal_training_ppqjhb.jpg', 'Personal trainer begeleidt een sessie op imbody', 1200, 1600),
  bench: img('v1774043013/IMBODY_Pro_S_in_moderne_woonkamer_szlfjc.jpg', 'Bank en kabelarm van de imbody Pro S', 1200, 1600),
  resistance: img('v1773856918/Resitance_hnm6ky.jpg', 'Digitale weerstand instellen op het scherm', 1600, 1600),

  /** Use cases */
  home: img('v1773850766/Thuisgebruiker_Smart_Gym_vltmkk.jpg', 'imbody Pro S voor thuisgebruik', 1200, 1600),
  rehab: img('v1773850629/REHAB_ghqux0.jpg', 'imbody Pro S voor revalidatie', 1200, 1600),
  office: img('v1773850629/Kantoorwellness_nz5gmy.jpg', 'imbody Pro S voor bedrijfs- en kantoorwellness', 1600, 1200),

  /** App screens for the three steps */
  stepAssessment: img('v1773850786/STAP_1_retmbu.png', 'Krachtmeting in de imbody app', 1200, 1200),
  stepPlan: img('v1773850787/STAP_2_c0xklh.png', 'Persoonlijk trainingsplan in de imbody app', 1200, 1200),
  stepProgress: img('v1773850786/STAP_3_ibie4p.png', 'Voortgang volgen in de imbody app', 1200, 1200),
}

/** What ships in the box, in display order. */
export const includedAccessories = [
  { key: 'btHandles', image: img('v1773850624/IMBODY_Bluetooth_Handles_ejkp7q.jpg', 'Bluetooth-handgrepen', 1200, 1200, 900) },
  { key: 'tBar', image: img('v1773850629/IMBODY_T_Bar_orka2h.jpg', 'T-bar', 1200, 1200, 900) },
  { key: 'ankleStraps', image: img('v1773850619/IMBODY_Ankle_Straps_nqki3s.jpg', 'Enkelbanden', 1200, 1200, 900) },
  { key: 'bench', image: img('v1773850621/IMBODY_Bench_zfu4lw.jpg', 'Trainingsbank', 1200, 1200, 900) },
  { key: 'bar', image: img('v1773850620/IMBODY_Bar_k3g7k9.jpg', 'Lange stang', 1200, 1200, 900) },
  { key: 'tricepRope', image: img('v1773850626/IMBODY_Tricep_rope_d3lmd8.jpg', 'Tricepstouw', 1200, 1200, 900) },
  { key: 'btController', image: img('v1773850623/IMBODY_Bluetooth_controller_lgxzvb.jpg', 'Bluetooth-controller', 1200, 1200, 900) },
  { key: 'rower', image: img('v1773850625/IMBODY_Roeibank_o2ocaq.jpg', 'Roeibank', 1200, 1200, 900) },
] as const

/** Photos sent in by customers, with their own one-line verdicts. */
export const customerShots = [
  ['v1773850630/Review_1_hck1dr.webp', 'Gewoon neerzetten en beginnen.', 'Just set it down and start.'],
  ['v1773850684/Review_2_u7owll.webp', 'Méér dan een fitnessspiegel.', 'Much more than a fitness mirror.'],
  ['v1773850684/Review_3_xku6ko.webp', 'Eindelijk geen toestel-chaos meer.', 'Finally, no more equipment clutter.'],
  ['v1773850712/Review_4_jwyais.webp', 'Support die écht helpt.', 'Support that really helps.'],
  ['v1773850631/Review_11_eecezw.webp', 'Hightech meets design.', 'High tech meets design.'],
  ['v1773850630/Review_10_oumki0.webp', 'Mijn homegym in één toestel!', 'My home gym in one device!'],
  ['v1773850631/Review_12_j7abbv.webp', 'Mijn dagelijkse motivator.', 'My daily motivator.'],
  ['v1773850671/Review_13_li0fmx.webp', 'Motivatie op de knop.', 'Motivation at the push of a button.'],
  ['v1773850683/Review_14_wfn1fr.webp', 'Compact, stil, effectief.', 'Compact, quiet, effective.'],
  ['v1773850712/Review_5_blqkpk.webp', 'Beste investering ooit.', 'Best investment ever.'],
  ['v1773850712/Review_6_d2sszq.webp', 'Professionele kwaliteit thuis.', 'Professional quality at home.'],
  ['v1773850713/Review_7_nmlxs7.webp', 'Heel tevreden!', 'Very happy!'],
  ['v1773850735/Review_9_xcjwsp.webp', 'Design op zijn best.', 'Design at its best.'],
  ['v1773850735/Review_8_yy1yyi.webp', 'Alles-in-één oplossing.', 'All-in-one solution.'],
].map(([id, nl, en]) => ({ caption: { en: en!, nl: nl! }, url: cld(id!, 720) }))
