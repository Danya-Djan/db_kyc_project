import * as React from 'react';
import { ArrowIcon, BitCoinIcon, ChartIcon, CopyIcon, FireIcon, SmallCoinIcon, TrendIcon, UpPriceIcon } from './commonIcons';
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
    UpPriceIcon: <UpPriceIcon/>
} as const;

type EIcons = typeof EIcons[keyof typeof EIcons];


export function Icon({ icon, className }: IconsProps) {
    return (
        icon 
    )
}