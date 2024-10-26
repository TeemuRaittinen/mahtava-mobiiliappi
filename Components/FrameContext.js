import React, { createContext, useContext, useState } from 'react';
import { minimalFrame, shadowFrame, roundedFrame, accentFrame } from './frames';

const FrameContext = createContext();

export const FrameProvider = ({ children }) => {
    const [frame, setFrame] = useState(minimalFrame);

    const switchFrame = (selectedFrame) => {
        switch (selectedFrame) {
            case 'shadow':
                setFrame(shadowFrame);
                break;
            case 'rounded':
                setFrame(roundedFrame);
                break;
            case 'accent':
                setFrame(accentFrame);
                break;
            default:
                setFrame(minimalFrame);
        }
    };

    return (
        <FrameContext.Provider value={{ frame, switchFrame }}>
            {children}
        </FrameContext.Provider>
    );
};

export const useFrame = () => useContext(FrameContext);
