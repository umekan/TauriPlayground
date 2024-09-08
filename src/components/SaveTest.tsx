import * as React from 'react';

export default function SaveTest() {
    const [value, setValue] = React.useState(() => localStorage.getItem('value') ? JSON.parse(localStorage.getItem('value')!) : 0);

    // 値が変更されたらローカルストレージに保存
    React.useEffect(() => {
        localStorage.setItem('value', JSON.stringify(value));
    }, [value]);

    return (
        <div>
            <p>
                <button onClick={() => setValue(value + 1)}>Increment</button>
                <button onClick={() => setValue(value - 1)}>Decrement</button>
            </p>
            <p>{value}</p>
        </div>
    );
}