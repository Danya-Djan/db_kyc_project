import * as React from 'react';
import { ArrowIcon, BitCoinIcon, ChartIcon, CopyIcon, FireIcon, ProfileIcon, SmallCoinIcon, StyleIcon, TrendIcon, UpPriceIcon } from './commonIcons';
import { MedalFirstIcon, MedalSecondIcon, MedalThirdIcon } from './medals';
interface IconsProps {
    icon: EIcons;
    className?: string;
}

export const EIcons = {
    SmallCoin: <SmallCoinIcon />,
    MedalFirst: <MedalFirstIcon/>,
    MedalSecond: <MedalSecondIcon/>,
    MedalThird: <MedalThirdIcon/>,
    ArrowIcon: <ArrowIcon/>,
    BitCoinIcon: <BitCoinIcon/>,
    FireIcon: <FireIcon/>,
    TrendIcon: <TrendIcon/>,
    ChartIcon: <ChartIcon/>,
    CopyIcon: <CopyIcon/>,
    UpPriceIcon: <UpPriceIcon/>,
    ProfileIcon: <ProfileIcon/>,
    StyleIcon: <StyleIcon />
} as const;

type EIcons = typeof EIcons[keyof typeof EIcons];


export function Icon({ icon, className }: IconsProps) {
    return (
        icon 
    )
}