import { useEffect, useState } from 'react';

export function useModel() {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setReady(true), 300);
        return () => clearTimeout(t);
    }, []);

    const predict = async (imageUriOrTensor) => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const specials = ['space', 'delete', 'nothing'];
        const classes = [...letters, ...specials];
        const pick = () => classes[Math.floor(Math.random() * classes.length)];
        const top1 = pick();
        const top3 = [top1, pick(), pick()].map((l, i) => ({
            label: l, prob: i === 0 ? 0.84 : i === 1 ? 0.11 : 0.05
        }));
        return { top1, top3, raw: null };
    };

    return { ready, predict };
}
