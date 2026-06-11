import { createContext, useContext, useReducer, useEffect } from 'react';

const INITIAL_PRODUCTS = [
    { id: 1, name: "Mleko 3,2%", category: 'Nabiał', amount: '2', unit: 'l', expiry: '2026-03-12', opened: true, notes: 'Przechowywać w lodówce' },
    { id: 2, name: "Chleb żytni", category: 'Pieczywo', amount: '1', unit: 'szt.', expiry: '2026-03-10', opened: true, notes: '' },
    { id: 3, name: "Pierś z kurczaka", category: 'Mięso i wędliny', amount: '0.5', unit: 'kg', expiry: '2026-03-08', opened: false, notes: 'Zamrażarka' },
    { id: 4, name: "Jabłka Gala", category: 'Warzywa i owoce', amount: '1', unit: 'kg', expiry: '2026-03-20', opened: false, notes: '' },
];

function pantryReducer(state, action) {
    switch(action.type) {
        case 'ADD':
            return [...state, { ...action.payload, id: Date.now() }];
        case 'REMOVE':
            return state.filter(p => p.id !== action.id);
        case 'LOAD':
            return action.payload;
        default:
            return state;
    }
}

const PantryContext = createContext(null);

export function PantryProvider({children}){
    const [products, dispatch] = useReducer(pantryReducer, INITIAL_PRODUCTS);

    useEffect(() => {
        localStorage.setItem('pantry', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        const saved = localStorage.getItem('pantry');
        if(saved)
            dispatch({type: 'LOAD', payload: JSON.parse(saved)});
    }, []);

    const addProduct = (product) => dispatch({type: 'ADD', payload: product});
    const removeProduct = (id) => dispatch({type: 'REMOVE', payload: id});

    return (
        <PantryContext.Provider value={{products, addProduct, removeProduct}}>
            {children}
        </PantryContext.Provider>
    )
}

export function usePantry() {
    const ctx = useContext(PantryContext);
    if(!ctx)
        throw new Error('usePantry musi być użyty wewnątrz PantryProvider');
    
    return ctx;
}