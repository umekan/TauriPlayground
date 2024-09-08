import { useState, useEffect } from "react";

export default function SaveTest() {
    const [value, setValue] = useState(() => localStorage.getItem('value') ? JSON.parse(localStorage.getItem('value')!) : 0);

    // 値が変更されたらローカルストレージに保存
    useEffect(() => {
        localStorage.setItem('value', JSON.stringify(value));
    }, [value]);

    return (
        <div>
            <p>
                <button onClick={() => setValue(value - 1)}>Decrement</button>
                <button onClick={() => setValue(value + 1)}>Increment</button>
            </p>
            <p>{value}</p>
        </div>
    );
}