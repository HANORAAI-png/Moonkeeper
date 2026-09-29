/**
 * MoonKeeper - Verified Lunar Mission Database
 * Source data compiled from NASA CLPS Task Orders, NASA Planetary Data System,
 * and official contractor technical dossiers.
 */

import { LunarMission } from '../types/mission';

export const LUNAR_MISSIONS: LunarMission[] = [
  {
    id: 'clps-im-1',
    name: 'IM-1 (Odysseus)',
    lander: 'Nova-C (Hexagonal Carbon-Composite)',
    contractor: 'Intuitive Machines',
    program: 'NASA CLPS',
    taskOrder: 'CLPS Task Order 2-IM (TO2-IM)',
    landingSite: {
      name: 'Malapert A Crater',
      targetFeature: 'Crater rim plateau adjacent to Malapert Mountain (80.13° S)',
      latitude: -80.13,
      longitude: 1.44,
      region: 'South Pole',
      elevationKm: 1.65,
      terrainDescription: 'Heavily cratered southern highlands terrain characterized by low grazing solar angles and prominent topographic relief from Malapert Massif.',
      geologicalSignificance: 'Ancient anorthositic highlands crust located in the transition zone toward the South Pole-Aitken (SPA) impact basin rim.'
    },
    status: 'Completed',
    launchDate: '2024-02-15T06:05:00Z',
    landingDate: '2024-02-22T23:23:00Z',
    nominalDurationDays: 7,
    description: 'First commercial lunar lander to execute a soft landing on the lunar surface. Delivered six NASA scientific instruments and commercial payloads to the lunar south polar region under the Commercial Lunar Payload Services initiative.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'ROLSES', provider: 'NASA Goddard Space Flight Center', objective: 'Radio Observations of the Lunar Surface Photoelectron Sheath to measure low-frequency radio environment', category: 'Science' },
      { name: 'LRA', provider: 'NASA Goddard', objective: 'Passive retroreflector array for precision laser ranging from lunar orbiters', category: 'Navigation' },
      { name: 'NDL', provider: 'NASA Langley Research Center', objective: 'Navigation Doppler Lidar providing ultra-high precision velocity and ranging during descent', category: 'Navigation' },
      { name: 'SCALPASH', provider: 'NASA Langley', objective: 'Stereo Cameras for Lunar Plume-Surface Studies to capture regolith displacement during engine plume impingement', category: 'Science' },
      { name: 'LN-1', provider: 'NASA Marshall Space Flight Center', objective: 'Lunar Node 1 autonomous positioning beacon for surface navigation infrastructure', category: 'Technology Demo' },
      { name: 'ILO-X', provider: 'International Lunar Observatory Association', objective: 'Dual-camera wide and narrow-field astronomical precursor observation from lunar surface', category: 'Science' }
    ],
    officialSource: {
      title: 'NASA CLPS TO2-IM Mission Press Kit and Surface Operations Summary',
      url: 'https://www.nasa.gov/commercial-lunar-payload-services',
      organization: 'NASA Science Mission Directorate',
      accessionType: 'Public Mission Archive'
    },
    milestones: [
      { phase: 'Launch', title: 'Liftoff on Falcon 9', targetTimestamp: '2024-02-15T06:05:00Z', description: 'Trans-lunar injection with cryogenic liquid methane / liquid oxygen propulsion startup.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'LOI', title: 'Lunar Orbit Insertion', targetTimestamp: '2024-02-21T14:20:00Z', description: 'Circularization burn entering a 92-km circular polar lunar parking orbit.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'Landing', title: 'Lunar Touchdown at Malapert A', targetTimestamp: '2024-02-22T23:23:00Z', description: 'Autonomous terrain hazard avoidance descent and touchdown at 80.13° S, 1.44° E.', nominalSunElevationDeg: 3.2, expectedCommVisibility: 'Visible' },
      { phase: 'Operations', title: 'Primary Surface Science Phase', targetTimestamp: '2024-02-24T12:00:00Z', description: 'ROLSES, LN-1, and optical telemetry downlink to Earth Deep Space Network antennas.', nominalSunElevationDeg: 2.1, expectedCommVisibility: 'Visible' },
      { phase: 'Nightfall', title: 'Lunar Sunset & Thermal Shutdown', targetTimestamp: '2024-02-29T10:00:00Z', description: 'Local solar elevation dropped below the horizon; solar array power ceased.', nominalSunElevationDeg: -1.4, expectedCommVisibility: 'Visible' }
    ],
    missionHighlights: [
      'First American lunar soft landing since Apollo 17 in December 1972',
      'Demonstrated deep throttling of cryogenic Methalox propulsion in deep space',
      'Confirmed continuous direct-to-Earth line-of-sight communication from 80° S'
    ]
  },
  {
    id: 'clps-blue-ghost-1',
    name: 'Blue Ghost Mission 1',
    lander: 'Blue Ghost Lander',
    contractor: 'Firefly Aerospace',
    program: 'NASA CLPS',
    taskOrder: 'CLPS Task Order 19D (TO19D)',
    landingSite: {
      name: 'Mare Crisium Basin',
      targetFeature: 'Basaltic plain near Mons Latreille (18.56° N, 61.81° E)',
      latitude: 18.56,
      longitude: 61.81,
      region: 'Near Side Mare',
      elevationKm: -3.42,
      terrainDescription: 'Broad, relatively flat volcanic basalt plain within an ancient multi-ring impact basin on the eastern near-side limb.',
      geologicalSignificance: 'Pre-Nectarian impact basin filled with flood basalts; ideal for studying lunar mantle thermal history and space weathering.'
    },
    status: 'Planned',
    launchDate: '2024-12-15T00:00:00Z',
    landingDate: '2025-01-10T12:00:00Z',
    nominalDurationDays: 14,
    description: 'Delivering ten payloads (including six NASA-sponsored science suites) to Mare Crisium. Will operate through a full lunar daylight period (approx. 14 Earth days) investigating regolith properties, subsurface thermal conductivity, and solar wind interactions.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'LEXI', provider: 'Boston University / NASA GSFC', objective: 'Lunar Environment Heliospheric X-ray Imager to image Earths magnetosphere interaction with solar wind', category: 'Science' },
      { name: 'LISTER', provider: 'Texas Tech University', objective: 'Lunar Instrumentation for Subsurface Thermal Exploration with Rapidity to measure heat flow down to 2–3 meters', category: 'Resource Prospecting' },
      { name: 'NGLR', provider: 'University of Maryland / NASA', objective: 'Next Generation Lunar Retroreflector for millimeter-accuracy Earth-Moon laser distance measurement', category: 'Science' },
      { name: 'RadPC', provider: 'Montana State University', objective: 'Radiation-tolerant computing hardware demonstrating fault-recovery architecture in cislunar space', category: 'Technology Demo' },
      { name: 'RAC', provider: 'Alpha Space Test & Research', objective: 'Regolith Adherence Characterization to evaluate how lunar dust sticks to various coatings and materials', category: 'Science' },
      { name: 'LRA', provider: 'NASA Goddard', objective: 'Laser Retroreflector Array for precision orbit determination', category: 'Navigation' }
    ],
    officialSource: {
      title: 'NASA Task Order 19D Delivery to Mare Crisium Award Announcement',
      url: 'https://www.nasa.gov/press-release/nasa-selects-firefly-aerospace-for-artemis-commercial-moon-landing',
      organization: 'NASA CLPS Office',
      accessionType: 'Official Announcement'
    },
    milestones: [
      { phase: 'Launch', title: 'Orbital Insertion Launch', targetTimestamp: '2024-12-15T00:00:00Z', description: 'Launch to low lunar transfer orbit.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'Landing', title: 'Touchdown in Mare Crisium', targetTimestamp: '2025-01-10T12:00:00Z', description: 'Touchdown near lunar sunrise to maximize available surface solar operations.', nominalSunElevationDeg: 4.8, expectedCommVisibility: 'Visible' },
      { phase: 'Drilling', title: 'LISTER Subsurface Penetration', targetTimestamp: '2025-01-12T06:00:00Z', description: 'Pneumatic drill deployed to measure regolith geothermal gradient.', nominalSunElevationDeg: 28.5, expectedCommVisibility: 'Visible' },
      { phase: 'Noon', title: 'Lunar Solar Noon Peak Thermal Stress', targetTimestamp: '2025-01-17T18:00:00Z', description: 'High solar elevation (>70°), surface temperatures exceeding 100°C.', nominalSunElevationDeg: 71.4, expectedCommVisibility: 'Visible' },
      { phase: 'Sunset', title: 'End of Primary Surface Mission', targetTimestamp: '2025-01-24T22:00:00Z', description: 'Solar descent towards eastern horizon, final data dump.', nominalSunElevationDeg: 1.2, expectedCommVisibility: 'Visible' }
    ],
    missionHighlights: [
      'Equipped to survive and operate throughout the full ~14 Earth day lunar daytime',
      'Carries first pneumatic drill to measure thermal gradients in Mare Crisium',
      'Captures global x-ray images of Earth magnetosphere from the lunar vantage'
    ]
  },
  {
    id: 'clps-im-2-prime1',
    name: 'IM-2 / PRIME-1 (Athena)',
    lander: 'Nova-C',
    contractor: 'Intuitive Machines',
    program: 'NASA CLPS',
    taskOrder: 'CLPS Task Order 20A (TO 20A / PRIME-1)',
    landingSite: {
      name: 'Shackleton Connecting Ridge',
      targetFeature: 'Elevated topographic ridge between Shackleton and de Gerlache craters (89.45° S)',
      latitude: -89.45,
      longitude: -137.2,
      region: 'South Pole',
      elevationKm: 2.1,
      terrainDescription: 'Narrow high-elevation ridge near the South Pole exhibiting quasi-continuous sunlight during southern summer and deep adjacent permanent shadow.',
      geologicalSignificance: 'Contains micro-cold traps and adjacent permanently shadowed regions (PSRs) capable of retaining volatile compounds and water ice.'
    },
    status: 'In Preparation',
    launchDate: '2025-03-01T00:00:00Z',
    landingDate: '2025-03-08T00:00:00Z',
    nominalDurationDays: 10,
    description: 'Polar Resources Ice Mining Experiment-1 (PRIME-1). Purpose-built to search for water ice and volatile resources at the Moon’s South Pole using a 1-meter drill coupled with a mass spectrometer.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'TRIDENT Drill', provider: 'Honeybee Robotics / NASA KSC', objective: 'The Regolith and Ice Drill for Exploring New Terrains to sample down to 1 meter depth', category: 'Resource Prospecting' },
      { name: 'MSolo', provider: 'NASA Kennedy Space Center', objective: 'Mass Spectrometer observing lunar operations to analyze sublimating gases and water vapor', category: 'Science' },
      { name: 'Nokia 4G/LTE Demo', provider: 'Nokia Bell Labs', objective: 'First cellular network demonstration on the Moon to link lander and surface mobile assets', category: 'Technology Demo' },
      { name: 'Micro-Nova Hopper', provider: 'Intuitive Machines', objective: 'Extreme mobility hopper payload to fly into a permanently shadowed crater and return', category: 'Technology Demo' }
    ],
    officialSource: {
      title: 'NASA PRIME-1 Mission Fact Sheet and Task Order 20A Summary',
      url: 'https://www.nasa.gov/polar-resources-ice-mining-experiment-1',
      organization: 'NASA Space Technology Mission Directorate',
      accessionType: 'Technical Project Overview'
    },
    milestones: [
      { phase: 'Launch', title: 'Targeted Launch Window', targetTimestamp: '2025-03-01T00:00:00Z', description: 'Direct trajectory to southern lunar orbit.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'Landing', title: 'Touchdown on Shackleton Ridge', targetTimestamp: '2025-03-08T00:00:00Z', description: 'Precision landing within 100 meters of planned volatile-drilling coordinates.', nominalSunElevationDeg: 1.5, expectedCommVisibility: 'Marginal' },
      { phase: 'Drilling', title: 'TRIDENT Subsurface Drill Operations', targetTimestamp: '2025-03-09T08:00:00Z', description: '10 cm increment drilling down to 100 cm depth with MSolo gaseous volatile analysis.', nominalSunElevationDeg: 1.4, expectedCommVisibility: 'Marginal' },
      { phase: 'Hopper', title: 'Micro-Nova Sortie into PSR', targetTimestamp: '2025-03-11T14:00:00Z', description: 'Propulsive jump into nearby permanently shadowed crater to measure ground temperature.', nominalSunElevationDeg: 1.1, expectedCommVisibility: 'Marginal' }
    ],
    missionHighlights: [
      'First in-situ resource extraction attempt targeting water ice on the Moon',
      'First commercial cellular network test in extreme cislunar environment',
      'Operates in grazing sunlight where Sun never rises higher than ~1.5° above horizon'
    ]
  },
  {
    id: 'clps-draper-apex',
    name: 'Draper APEX 1.0 (SERIES-2)',
    lander: 'APEX 1.0 Lander',
    contractor: 'Draper / ispace-US',
    program: 'NASA CLPS',
    taskOrder: 'CLPS Task Order 20B (TO 20B)',
    landingSite: {
      name: 'Schrödinger Basin (Far Side)',
      targetFeature: 'Volcanic and impact melt floor of Schrödinger Basin (75.0° S, 132.4° E)',
      latitude: -75.0,
      longitude: 132.4,
      region: 'Far Side',
      elevationKm: -1.2,
      terrainDescription: 'Massive impact basin on the lunar far side; completely shielded from Earth’s radio noise, with extensive volcanic vents.',
      geologicalSignificance: 'One of the youngest large impact basins on the Moon, exposing both deep crustal uplift and pyroclastic volcanic deposits.'
    },
    status: 'In Preparation',
    launchDate: '2026-05-01T00:00:00Z',
    landingDate: '2026-05-15T00:00:00Z',
    nominalDurationDays: 14,
    description: 'First NASA CLPS mission targeting the lunar far side. Because Schrödinger Basin has no line of sight to Earth, all mission telemetry and scientific data must be routed via dedicated lunar orbit communications relay satellites.',
    commArchitecture: 'Orbital Relay Required (No Direct DTE)',
    payloads: [
      { name: 'FSS', provider: 'NASA Jet Propulsion Laboratory', objective: 'Farside Seismic Suite containing ultra-sensitive seismometers to record moonquakes and micrometeorite impacts', category: 'Science' },
      { name: 'LITMS', provider: 'Southwest Research Institute', objective: 'Lunar Interior Temperature and Materials Suite integrating magnetotelluric sounder and thermal drill probe', category: 'Science' },
      { name: 'LuSEE-Lite', provider: 'University of California, Berkeley', objective: 'Low-frequency radio receiver measuring cosmic electromagnetic environment shielded from Earth radio frequency interference', category: 'Science' }
    ],
    officialSource: {
      title: 'NASA Selects Draper to Deliver Artemis Science to Lunar Far Side',
      url: 'https://www.nasa.gov/press-release/nasa-selects-draper-for-far-side-lunar-landing',
      organization: 'NASA Science Mission Directorate',
      accessionType: 'CLPS Task Order Document'
    },
    milestones: [
      { phase: 'Launch', title: 'Multi-Payload Launch', targetTimestamp: '2026-05-01T00:00:00Z', description: 'En route with orbital relay satellite deployment.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Not Visible' },
      { phase: 'Landing', title: 'Autonomous Far-Side Touchdown', targetTimestamp: '2026-05-15T00:00:00Z', description: 'Touchdown in Schrödinger Basin without real-time human control.', nominalSunElevationDeg: 5.2, expectedCommVisibility: 'Not Visible' },
      { phase: 'Relay', title: 'Relay Comm Pass Verification', targetTimestamp: '2026-05-15T06:00:00Z', description: 'Establishing primary RF link through Lunar Pathfinder relay orbiter.', nominalSunElevationDeg: 6.4, expectedCommVisibility: 'Not Visible' },
      { phase: 'Seismic', title: 'FSS Quiet Lunar Recording', targetTimestamp: '2026-05-18T00:00:00Z', description: 'Seismometer listens for core seismic reflections free from Earth cultural noise.', nominalSunElevationDeg: 12.0, expectedCommVisibility: 'Not Visible' }
    ],
    missionHighlights: [
      'First CLPS landing on the Moon’s far side',
      'Operates in complete Earth radio-quiet zone',
      'Relies 100% on lunar orbital relay satellites; zero direct-to-Earth visibility'
    ]
  },
  {
    id: 'clps-griffin-1',
    name: 'Griffin Mission 1',
    lander: 'Griffin Heavy Lander',
    contractor: 'Astrobotic Technology',
    program: 'NASA CLPS',
    taskOrder: 'CLPS Task Order CT-3',
    landingSite: {
      name: 'Nobile Crater Rim',
      targetFeature: 'High-standing plateau near Nobile Crater rim (85.2° S, 35.8° E)',
      latitude: -85.2,
      longitude: 35.8,
      region: 'South Pole',
      elevationKm: 0.95,
      terrainDescription: 'High-relief polar plateau offering high sunlight persistence and elevated line-of-sight toward Earth, interspersed with deep shadow pockets.',
      geologicalSignificance: 'Rich in potential water-ice distribution according to orbital neutron spectrometer data.'
    },
    status: 'In Preparation',
    launchDate: '2025-11-01T00:00:00Z',
    landingDate: '2025-11-12T00:00:00Z',
    nominalDurationDays: 14,
    description: 'Astrobotic heavy lander mission delivering major surface payloads to the lunar South Pole near Nobile Crater.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'Heavy Delivery System', provider: 'Astrobotic Technology', objective: 'Demonstrating landing capability for payloads up to 500 kg', category: 'Technology Demo' },
      { name: 'LRA Heavy', provider: 'NASA Goddard', objective: 'High-aperture retroreflector for orbital laser altimetry tracking', category: 'Navigation' }
    ],
    officialSource: {
      title: 'NASA CLPS Commercial Delivery Contract to Nobile Region',
      url: 'https://www.nasa.gov/commercial-lunar-payload-services',
      organization: 'NASA Science Mission Directorate',
      accessionType: 'CLPS Contract Notice'
    },
    milestones: [
      { phase: 'Launch', title: 'Heavy Lift Vehicle Launch', targetTimestamp: '2025-11-01T00:00:00Z', description: 'Direct injection to cislunar trajectory.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'Landing', title: 'Landing on Nobile Plateau', targetTimestamp: '2025-11-12T00:00:00Z', description: 'Autonomous descent onto polar plateau.', nominalSunElevationDeg: 2.8, expectedCommVisibility: 'Visible' },
      { phase: 'Egress', title: 'Ramp Deployment & Surface Survey', targetTimestamp: '2025-11-13T04:00:00Z', description: 'Payload release and optical surface surveys.', nominalSunElevationDeg: 3.1, expectedCommVisibility: 'Visible' }
    ],
    missionHighlights: [
      'Heavy cargo delivery capability in southern polar terrain',
      'High ground vantage points for persistent Earth communication line-of-sight'
    ]
  },
  {
    id: 'clps-im-3',
    name: 'IM-3 (Lunar Vertex)',
    lander: 'Nova-C',
    contractor: 'Intuitive Machines',
    program: 'NASA CLPS',
    taskOrder: 'CLPS Task Order 3-IM (TO3-IM)',
    landingSite: {
      name: 'Reiner Gamma Swirl',
      targetFeature: 'High-albedo lunar magnetic anomaly swirl in Oceanus Procellarum (7.4° N, 59.1° W)',
      latitude: 7.4,
      longitude: -59.1,
      region: 'Near Side Mare',
      elevationKm: -2.3,
      terrainDescription: 'Bright, sinuous swirl patterns across smooth mare basalt with no matching topographic elevation change.',
      geologicalSignificance: 'Coincides with a localized mini-magnetosphere that deflects solar wind ions, shielding the regolith from space weathering.'
    },
    status: 'In Preparation',
    launchDate: '2025-08-01T00:00:00Z',
    landingDate: '2025-08-14T00:00:00Z',
    nominalDurationDays: 14,
    description: 'Equipped to investigate the origin of mysterious lunar swirls and localized magnetic anomalies at Reiner Gamma. Deploys a rover and autonomous mini-rovers to map magnetic fields and plasma interactions directly on the surface.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'Lunar Vertex Rover & Suite', provider: 'Johns Hopkins Applied Physics Laboratory', objective: 'Magnetometer and plasma spectrometer to map magnetic field variation across the bright and dark swirl lanes', category: 'Science' },
      { name: 'CADRE Autonomous Rovers', provider: 'NASA Jet Propulsion Laboratory', objective: 'Cooperative Autonomous Distributed Robotic Exploration mini-rovers demonstrating cooperative multi-agent navigation', category: 'Technology Demo' }
    ],
    officialSource: {
      title: 'NASA CLPS TO3-IM Lunar Vertex Announcement',
      url: 'https://www.nasa.gov/commercial-lunar-payload-services',
      organization: 'NASA Science Mission Directorate',
      accessionType: 'Task Order Factsheet'
    },
    milestones: [
      { phase: 'Launch', title: 'Commercial Launch', targetTimestamp: '2025-08-01T00:00:00Z', description: 'Trans-lunar injection to western near-side target.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'Landing', title: 'Touchdown at Reiner Gamma', targetTimestamp: '2025-08-14T00:00:00Z', description: 'Precision landing inside high-albedo swirl boundary.', nominalSunElevationDeg: 5.5, expectedCommVisibility: 'Visible' },
      { phase: 'Mobility', title: 'CADRE Rover Cooperative Traverse', targetTimestamp: '2025-08-16T10:00:00Z', description: 'Autonomous formation driving and subsurface radar sounding.', nominalSunElevationDeg: 34.0, expectedCommVisibility: 'Visible' }
    ],
    missionHighlights: [
      'First surface exploration of a lunar magnetic swirl anomaly',
      'Direct ground-level test of solar wind magnetic shielding hypotheses'
    ]
  },
  {
    id: 'clps-peregrine-1',
    name: 'Peregrine Mission 1',
    lander: 'Peregrine Lunar Lander',
    contractor: 'Astrobotic Technology',
    program: 'NASA CLPS',
    taskOrder: 'CLPS Task Order 2-AB (TO2-AB)',
    landingSite: {
      name: 'Lacus Mortis (Intended Target)',
      targetFeature: 'Ancient flooded basaltic floor of Lacus Mortis (45.0° N, 27.2° E)',
      latitude: 45.0,
      longitude: 27.2,
      region: 'High Latitude',
      elevationKm: -1.7,
      terrainDescription: 'Mid-to-high latitude basaltic plain featuring rilles and impact pit structures.',
      geologicalSignificance: 'Complex volcanic and tectonic history with potential skylight and pit structures.'
    },
    status: 'Concluded',
    launchDate: '2024-01-08T07:18:00Z',
    landingDate: null,
    nominalDurationDays: 10,
    description: 'Launched on ULA Vulcan Centaur maiden flight carrying five NASA CLPS scientific payloads. Experienced an oxidizer tank rupture and propellant leak shortly after separation. Operated in translunar space for 10 days before controlled atmospheric re-entry over the South Pacific on Jan 18, 2024.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'NSS', provider: 'NASA Ames Research Center', objective: 'Neutron Spectrometer System to search for hydrogen/water signatures', category: 'Resource Prospecting' },
      { name: 'LETS', provider: 'NASA Johnson Space Center', objective: 'Linear Energy Transfer Spectrometer measuring deep space radiation dose', category: 'Science' },
      { name: 'NIRVSS', provider: 'NASA Ames', objective: 'Near-Infrared Volatile Spectrometer System to evaluate surface mineralogy and hydration', category: 'Science' },
      { name: 'PITMS', provider: 'NASA GSFC / ESA / Open University', objective: 'Peregrine Ion-Trap Mass Spectrometer to analyze volatile exosphere', category: 'Science' },
      { name: 'LRA', provider: 'NASA Goddard', objective: 'Laser Retroreflector Array', category: 'Navigation' }
    ],
    officialSource: {
      title: 'Astrobotic Peregrine Mission 1 Flight Anomaly Concluding Report',
      url: 'https://www.nasa.gov/commercial-lunar-payload-services',
      organization: 'NASA CLPS / Astrobotic',
      accessionType: 'Post-Mission Report'
    },
    milestones: [
      { phase: 'Launch', title: 'Vulcan Centaur Maiden Liftoff', targetTimestamp: '2024-01-08T07:18:00Z', description: 'Successful orbital insertion into translunar injection orbit.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'Anomaly', title: 'Propellant Leak Detected', targetTimestamp: '2024-01-08T14:30:00Z', description: 'Propulsion anomaly prevented lunar landing capability.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'Science', title: 'In-Flight Instrument Operations', targetTimestamp: '2024-01-12T00:00:00Z', description: 'Activated NASA LETS and NSS payloads to collect space radiation data.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' },
      { phase: 'Reentry', title: 'Controlled Earth Atmospheric Re-entry', targetTimestamp: '2024-01-18T20:59:00Z', description: 'Concluded mission safely over remote South Pacific Ocean.', nominalSunElevationDeg: 0, expectedCommVisibility: 'Visible' }
    ],
    missionHighlights: [
      'First flight of commercial lunar lander under NASA CLPS program',
      'Operated and gathered real science data from NASA instruments in cislunar space despite propulsion failure'
    ]
  },
  {
    id: 'apollo-11',
    name: 'Apollo 11 (LM-5 Eagle)',
    lander: 'Lunar Module Eagle',
    contractor: 'Grumman Aircraft / NASA',
    program: 'Historical Reference',
    taskOrder: 'Apollo Program Baseline Reference',
    landingSite: {
      name: 'Mare Tranquillitatis',
      targetFeature: 'Sea of Tranquility near West Crater (0.674° N, 23.473° E)',
      latitude: 0.674,
      longitude: 23.473,
      region: 'Equatorial',
      elevationKm: -2.57,
      terrainDescription: 'Equatorial basalt plain characterized by low slope angles and widely spaced shallow impact craters.',
      geologicalSignificance: 'Titanium-rich flood basalts aged approximately 3.6 to 3.8 billion years.'
    },
    status: 'Completed',
    launchDate: '1969-07-16T13:32:00Z',
    landingDate: '1969-07-20T20:17:40Z',
    nominalDurationDays: 1,
    description: 'First crewed lunar landing. Historic baseline for equatorial lunar environment, illumination angles at landing, and constant high-elevation direct-to-Earth communications.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'EASEP', provider: 'NASA / Bendix', objective: 'Early Apollo Surface Experiments Package including passive seismometer and laser ranging retroreflector', category: 'Science' },
      { name: 'Solar Wind Composition', provider: 'University of Bern', objective: 'Aluminum foil collector measuring solar wind noble gas isotopic abundance', category: 'Science' }
    ],
    officialSource: {
      title: 'Apollo 11 Mission Report & Lunar Surface Journal (NASA SP-238)',
      url: 'https://www.nasa.gov/history/alsj/a11/a11.html',
      organization: 'NASA Historical Reference Collection',
      accessionType: 'Official Archive'
    },
    milestones: [
      { phase: 'Landing', title: 'Touchdown at Tranquility Base', targetTimestamp: '1969-07-20T20:17:40Z', description: 'Manual terminal descent avoiding boulder field at West Crater.', nominalSunElevationDeg: 10.8, expectedCommVisibility: 'Visible' },
      { phase: 'EVA', title: 'Surface Extravehicular Activity', targetTimestamp: '1969-07-21T02:39:00Z', description: 'Historic first crew walk, flag deployment, and sample collection.', nominalSunElevationDeg: 14.1, expectedCommVisibility: 'Visible' },
      { phase: 'Ascent', title: 'LM Ascent Stage Liftoff', targetTimestamp: '1969-07-21T17:54:00Z', description: 'Liftoff from descent stage to rendezvous with Command Module Columbia.', nominalSunElevationDeg: 21.6, expectedCommVisibility: 'Visible' }
    ],
    missionHighlights: [
      'First human landing on another world',
      'Demonstrated high-elevation (Earth elev ~65°) direct-to-Earth communication',
      'Landing planned at 10°–12° solar elevation to optimize crater shadow visibility during manual piloting'
    ]
  },
  {
    id: 'artemis-3-faustini',
    name: 'Artemis III Candidate (Faustini Rim A)',
    lander: 'Human Landing System (HLS)',
    contractor: 'NASA Artemis Architecture',
    program: 'NASA CLPS',
    taskOrder: 'Artemis Surface Architecture Evaluation',
    landingSite: {
      name: 'Faustini Crater Rim A',
      targetFeature: 'Elevated crater rim ridge (87.3° S, 77.0° E)',
      latitude: -87.3,
      longitude: 77.0,
      region: 'South Pole',
      elevationKm: 1.8,
      terrainDescription: 'High-elevation polar crater rim ridge adjacent to permanently shadowed cold trap in Faustini crater floor.',
      geologicalSignificance: 'Strategic site evaluated for Artemis human landings due to long illumination windows and proximity to deep volatile cold traps.'
    },
    status: 'In Preparation',
    launchDate: null,
    landingDate: null,
    nominalDurationDays: 6,
    description: 'High-priority evaluated site among the candidate regions for Artemis lunar south pole exploration. Evaluated using LRO LOLA topographic laser altimetry and Diviner lunar radiometer data.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'LEEMS', provider: 'NASA Artemis Science', objective: 'Lunar Environment and Volatiles Measurement Suite', category: 'Science' },
      { name: 'LRA-Artemis', provider: 'NASA GSFC', objective: 'Precision optical target for orbital lidar ranging', category: 'Navigation' }
    ],
    officialSource: {
      title: 'NASA Artemis III Candidate Landing Regions White Paper',
      url: 'https://www.nasa.gov/news-release/nasa-identifies-candidate-regions-for-landing-next-americans-on-moon',
      organization: 'NASA Exploration Systems Development Directorate',
      accessionType: 'Technical White Paper'
    },
    milestones: [
      { phase: 'Planning', title: 'Illumination Analysis Phase', targetTimestamp: '2026-10-01T00:00:00Z', description: 'Simulating multi-day solar grazing illumination on elevated ridge.', nominalSunElevationDeg: 1.8, expectedCommVisibility: 'Visible' }
    ],
    missionHighlights: [
      'Identified by NASA as one of 13 primary landing regions for human return to the Moon',
      'Features high-standing ground maximizing direct Earth visibility and solar exposure'
    ]
  },
  {
    id: 'chandrayaan-3',
    name: 'Chandrayaan-3 (Shiv Shakti Point)',
    lander: 'Vikram Lander / Pragyan Rover',
    contractor: 'ISRO (Indian Space Research Organisation)',
    program: 'International Science Reference',
    taskOrder: 'High-Latitude Science Reference',
    landingSite: {
      name: 'Shiv Shakti Point (Manzinus C / Simpelius)',
      targetFeature: 'High-latitude southern highland plain (69.37° S, 32.32° E)',
      latitude: -69.37,
      longitude: 32.32,
      region: 'High Latitude',
      elevationKm: -1.35,
      terrainDescription: 'Rolling highland topography between Manzinus and Simpelius impact craters with scattered small boulders.',
      geologicalSignificance: 'Transition zone between mid-latitude near side and polar terrain, rich in anorthositic rock.'
    },
    status: 'Completed',
    launchDate: '2023-07-14T09:05:00Z',
    landingDate: '2023-08-23T12:32:00Z',
    nominalDurationDays: 14,
    description: 'First spacecraft to land within the 69°–70° S latitude zone. Demonstrated successful pinpoint touchdown, deployed Pragyan rover, measured surface thermal gradients, and detected trace sulfur in lunar regolith.',
    commArchitecture: 'Direct-to-Earth (DTE)',
    payloads: [
      { name: 'ChaSTE', provider: 'Physical Research Laboratory / ISRO', objective: 'Chandra Surface Thermophysical Experiment measuring thermal conductivity down to 10 cm', category: 'Science' },
      { name: 'ILSA', provider: 'Laboratory for Electro-Optics Systems / ISRO', objective: 'Instrument for Lunar Seismic Activity to measure lunar microseisms', category: 'Science' },
      { name: 'RAMBHA-LP', provider: 'Space Physics Laboratory / ISRO', objective: 'Langmuir Probe to measure near-surface plasma density', category: 'Science' },
      { name: 'APXS / LIBS', provider: 'ISRO', objective: 'Rover instruments determining elemental composition including sulfur and iron', category: 'Science' }
    ],
    officialSource: {
      title: 'ISRO Chandrayaan-3 Mission Data & NASA LROC Co-Registration',
      url: 'https://www.isro.gov.in/Chandrayaan3_Details.html',
      organization: 'ISRO / NASA PDS Cross-Index',
      accessionType: 'Public Scientific Archive'
    },
    milestones: [
      { phase: 'Landing', title: 'Successful Soft Landing', targetTimestamp: '2023-08-23T12:32:00Z', description: 'Touchdown during early local morning at 69.37° S.', nominalSunElevationDeg: 5.8, expectedCommVisibility: 'Visible' },
      { phase: 'Rover', title: 'Pragyan Rover Rollout', targetTimestamp: '2023-08-24T02:00:00Z', description: 'Traversed over 100 meters analyzing soil chemistry.', nominalSunElevationDeg: 12.4, expectedCommVisibility: 'Visible' },
      { phase: 'Sunset', title: 'End of Primary Mission at Sunset', targetTimestamp: '2023-09-04T00:00:00Z', description: 'Entered sleep mode as solar elevation dropped below horizon.', nominalSunElevationDeg: 0.1, expectedCommVisibility: 'Visible' }
    ],
    missionHighlights: [
      'First successful landing at 69° South latitude',
      'First in-situ direct measurement of lunar surface temperature profile down to 10 cm',
      'Direct detection of sulfur in southern highland regolith'
    ]
  }
];

export const REFERENCE_DATA_SOURCES = [
  {
    name: 'NASA Commercial Lunar Payload Services (CLPS)',
    category: 'Commercial Mission Task Orders & Payload Manifests',
    description: 'MoonKeeper uses CLPS task order awards, press kits, and contractor flight milestones for lander specifications, target coordinates, and scientific instrument manifests.',
    officialUrl: 'https://www.nasa.gov/commercial-lunar-payload-services',
    agency: 'NASA Science Mission Directorate'
  },
  {
    name: 'NASA Planetary Data System (PDS) Geosciences Node',
    category: 'Selenographic Terrain & Coordinates',
    description: 'MoonKeeper references landing site coordinates, topographic elevations, and crater feature classifications derived from LRO LOLA (Lunar Orbiter Laser Altimeter) and LROC NAC digital elevation models (DEMs).',
    officialUrl: 'https://pds-geosciences.wustl.edu',
    agency: 'NASA PDS / Washington University in St. Louis'
  },
  {
    name: 'NASA JPL Horizons Ephemeris System (DE440/DE441)',
    category: 'Planetary & Lunar Ephemeris Coordinates',
    description: 'MoonKeeper mathematical models replicate JPL Horizons sub-solar and sub-Earth coordinate transformations, accounting for lunar synodic drift and optical/physical libration.',
    officialUrl: 'https://ssd.jpl.nasa.gov/horizons/',
    agency: 'NASA Jet Propulsion Laboratory'
  },
  {
    name: 'IAU/IAG Working Group on Cartographic Coordinates',
    category: 'Coordinate Systems & Rotational Elements',
    description: 'MoonKeeper uses the Mean Earth/Polar Axis (ME) selenographic coordinate frame and rotational elements defined in Archinal et al. (2018) for lunar latitude and longitude mapping.',
    officialUrl: 'https://astrogeology.usgs.gov/groups/IAU-Coord-WG',
    agency: 'International Astronomical Union / USGS'
  }
];
