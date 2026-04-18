export const LICENSE_TYPES = [
    {
        value: 'cc-by',
        label: 'CC BY 4.0',
        fullName: 'Creative Commons Attribution 4.0 International',
        description: 'Allows redistribution, commercial use, and adaptations with attribution.',
        url: 'https://creativecommons.org/licenses/by/4.0/',
    },
    {
        value: 'cc-by-nc',
        label: 'CC BY-NC 4.0',
        fullName: 'Creative Commons Attribution-NonCommercial 4.0 International',
        description:
            'Allows redistribution and adaptations for non-commercial use with attribution.',
        url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    },
    {
        value: 'cc-by-nc-nd',
        label: 'CC BY-NC-ND 4.0',
        fullName: 'Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International',
        description:
            'Allows redistribution for non-commercial use with attribution, no modifications.',
        url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    },
    {
        value: 'cc-by-sa',
        label: 'CC BY-SA 4.0',
        fullName: 'Creative Commons Attribution-ShareAlike 4.0 International',
        description:
            'Allows redistribution and adaptations with attribution, derivatives must use same license.',
        url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
] as const;

export type LicenseTypeValue = (typeof LICENSE_TYPES)[number]['value'];
