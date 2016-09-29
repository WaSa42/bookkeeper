export const DIFFERENCE_TYPES = {
    1: 'RETRAITEMENTS FISCAUX 100%',
    2: 'RETRAITEMENTS FISCAUX PARTIELS',
    3: 'RETRAITEMENTS FISCAUX PARTIELS AVEC SAISIE',
    4: 'RETRAITEMENTS FISCAUX POTENTIELS'
};

export const DIFFERENCES = [{
    name: 'TVTS',
    tag: 1,
    fileNum: 320,
    nature: 'D',
    alertAccounts: ['63514'],
    alertLabs: [],
    manualAmount: [],
    debitAccount: 'F19',
    creditAccount: 'F63514',
    case2058A: 'WG',
    type: 1
}, {
    name: 'Amendes et pénalités',
    tag: 2,
    fileNum: 364,
    nature: 'D',
    alertAccounts: ['6712'],
    alertLabs: [],
    questions: [],
    manualAmount: false,
    debitAccount: 'F19',
    creditAccount: 'F6712',
    case2058A: 'WJ',
    type: 1
}, {
    name: 'Dégrèvement d\'impôt',
    tag: 3,
    fileNum: 283,
    nature: 'D',
    alertAccounts: ['7717'],
    alertLabs: [],
    questions: [],
    manualAmount: false,
    debitAccount: 'F7717',
    creditAccount: 'F19',
    case2058A: 'XG',
    type: 1
}, {
    name: 'CICE',
    tag: 4,
    fileNum: 325,
    nature: 'D',
    alertAccounts: ['649'],
    alertLabs: [],
    questions: [],
    manualAmount: false,
    debitAccount: 'F649',
    creditAccount: 'F19',
    case2058A: 'XG',
    type: 1
}, {
    name: 'Amendes et pénalités',
    tag: 5,
    fileNum: 364,
    nature: 'D',
    alertAccounts: ['6711'],
    alertLabs: [],
    questions: [],
    manualAmount: false,
    debitAccount: 'F19',
    creditAccount: 'F6711',
    case2058A: 'WJ',
    type: 2
}, {
    name: 'Provision retraite',
    tag: 6,
    fileNum: 224,
    nature: 'D',
    alertAccounts: ['6815'],
    alertLabs: [],
    questions: [],
    manualAmount: false,
    debitAccount: 'F19',
    creditAccount: 'F6815',
    case2058A: 'WI',
    type: 2
}, {
    name: 'Société mère et filiale',
    tag: 7,
    fileNum: 273,
    nature: 'D',
    alertAccounts: ['7611'],
    alertLabs: [],
    questions: [],
    manualAmount: true,
    debitAccount: 'F7611',
    creditAccount: 'F19',
    case2058A: 'XA',
    type: 3
}, {
    name: 'Amortissement VT',
    tag: 8,
    fileNum: 26,
    nature: 'D',
    alertAccounts: ['68112'],
    alertLabs: [],
    questions: [],
    manualAmount: true,
    debitAccount: 'F19',
    creditAccount: 'F68112',
    case2058A: 'WE',
    type: 3
}, {
    name: 'Location VT',
    tag: 9,
    fileNum: 300,
    nature: 'D',
    alertAccounts: ['6122'],
    alertLabs: [],
    questions: [],
    manualAmount: true,
    debitAccount: 'F19',
    creditAccount: 'F6122',
    case2058A: 'WF',
    type: 3
}, {
    name: 'Intérêts C/C',
    tag: 10,
    fileNum: 341,
    nature: 'D',
    alertAccounts: ['6615'],
    alertLabs: [],
    questions: [],
    manualAmount: true,
    debitAccount: 'F19',
    creditAccount: 'F6615',
    case2058A: 'WQ',
    type: 3
}, {
    name: 'Titres à prépondérance immobilière',
    tag: 11,
    fileNum: 402,
    nature: 'D',
    alertAccounts: ['775'],
    alertLabs: [],
    questions: [{
        type: 'YN',
        text: 'Le titre est-il détenu depuis plus de 2 ans ?'
    }],
    manualAmount: true,
    debitAccount: 'F775',
    creditAccount: 'F19',
    case2058A: 'WQ',
    type: 4
}, {
    name: 'Valeur plus ou moins latente',
    tag: 12,
    fileNum: 110,
    nature: 'P',
    alertAccounts: ['50'],
    alertLabs: [],
    questions: [{
        type: 'YN',
        text: 'La valeur est-elle plus ou moins latente ?'
    }],
    manualAmount: true,
    debitAccount: {
        positive: 'F50',
        negative: 'F667'
    },
    creditAccount: {
        positive: 'F767',
        negative: 'F50'
    },
    case2058A: {
        positive: 'XR',
        negative: 'XS'
    },
    type: 4
}, {
    name: 'Investissement productif',
    tag: 13,
    fileNum: 22,
    nature: 'D',
    alertAccounts: ['21', '20'],
    alertLabs: [],
    questions: [{
        type: 'YN',
        text: 'Eligible au suramortissement ?'
    }],
    manualAmount: true,
    debitAccount: 'F6811',
    creditAccount: 'F106',
    case2058A: 'WQ',
    type: 4
}, {
    name: 'Mécénat/dons',
    tag: 14,
    fileNum: 316,
    nature: 'D',
    alertAccounts: ['6234'],
    alertLabs: [],
    questions: [],
    manualAmount: false,
    debitAccount: 'F19',
    creditAccount: 'F6234',
    case2058A: 'WQ',
    type: 4
}];
