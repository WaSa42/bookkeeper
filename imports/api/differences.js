export const DIFFERENCE_TYPES = {
    1: 'RETRAITEMENTS FISCAUX 100%',
    2: 'RETRAITEMENTS FISCAUX PARTIELS',
    3: 'RETRAITEMENTS FISCAUX PARTIELS AVEC SAISIE DU MONTANT'
};

export const DIFFERENCES = [{
    name: 'TVTS',
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
}];
