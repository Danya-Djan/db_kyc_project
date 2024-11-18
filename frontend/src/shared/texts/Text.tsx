export const ETextStyles = {
    //Raleway
    //Regular
    RwRg10120: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '10px',
        lineHeight: '120%',
    },
    RwRg10140: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '10px',
        lineHeight: '140%',
        fontWeight: '400'
    },
    RwRg12120: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '12px',
        lineHeight: '120%',
        fontWeight: '400'
    },
    RwRg14100: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '14px',
        lineHeight: '100%',
        fontWeight: '400'
    },
    //Semibold
    RwSb12120: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '12px',
        lineHeight: '120%',
        fontWeight: '600'
    },
    RwSb14120: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '14px',
        lineHeight: '120%',
        fontWeight: '600'
    },
    RwSb16120: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '16px',
        lineHeight: '120%',
        fontWeight: '600'
    },
    RwSb18120: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '18px',
        lineHeight: '120%',
        fontWeight: '600'
    },
    RwSb24100: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '24px',
        lineHeight: '100%',
        fontWeight: '600'
    },
    RwSb26100: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '26px',
        lineHeight: '100%',
        fontWeight: '600'
    },
    RwSb30100: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '30px',
        lineHeight: '100%',
        fontWeight: '600'
    },
    //Inter
    //Regular
    InRg10140: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        fontSize: '10px',
        lineHeight: '140%',
    },
    InRg12140: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        fontSize: '12px',
        lineHeight: '140%',
    },
    InRg14120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '120%',
    },
    //SemiBold
    InSb10120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        fontSize: '10px',
        lineHeight: '120%',
    },
    InSb12120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        fontSize: '12px',
        lineHeight: '120%',
    },
    InSb14120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        fontSize: '14px',
        lineHeight: '120%',
    },
    InSb16120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        fontSize: '16px',
        lineHeight: '120%',
    },
    InSb18100: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        fontSize: '18px',
        lineHeight: '100%',
    },
    InSb24100: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '600',
        fontSize: '24px',
        lineHeight: '100%',
    },
    //Bold
    InBd14120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '120%',
    },
    InBd1412008: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '700',
        fontSize: '14px',
        lineHeight: '120%',
        letterSpacing: '0.8px'
    },
    InBd18120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '700',
        fontSize: '18px',
        lineHeight: '120%',
        letterSpacing: '0.3px'
    },
    //ExtraBold
    InEb14120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '800',
        fontSize: '14px',
        lineHeight: '120%',
    },
    InEb16120: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: '800',
        fontSize: '16px',
        lineHeight: '120%',
    },
} as const;

export type ETexts = typeof ETextStyles[keyof typeof ETextStyles];

