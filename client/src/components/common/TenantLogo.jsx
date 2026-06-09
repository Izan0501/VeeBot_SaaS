import React, { useState, useCallback, memo } from 'react';

export const TenantLogo = memo(function TenantLogo({ logoUrl, companyName, size = 44 }) {
    const [imgError, setImgError] = useState(false);

    const initials = (() => {
        if (!companyName || !companyName.trim()) return '?';
        const words = companyName.trim().split(/\s+/).filter(Boolean);
        if (words.length === 1) return words[0][0].toUpperCase();
        return (words[0][0] + words[1][0]).toUpperCase();
    })();

    const handleError = useCallback(() => setImgError(true), []);

    if (logoUrl && !imgError) {
        return (
            <img
                src={logoUrl}
                alt={`${companyName} logo`}
                onError={handleError}
                className="relative z-10 object-contain rounded-lg"
                style={{ width: size, height: size }}
                crossOrigin="anonymous"
            />
        );
    }

    return (
        <div
            className="relative z-10 flex items-center justify-center rounded-xl font-black text-white select-none bg-brand"
            style={{ width: size, height: size, fontSize: size * 0.36 }}
            aria-label={companyName}
        >
            {initials}
        </div>
    );
});
