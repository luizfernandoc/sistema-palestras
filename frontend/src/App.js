import { useState, useEffect } from "react";

function App() {
    const [palestras, setPalestras] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/palestras")
            .then(res => res.json())
            .then(data => setPalestras(data))
            .catch(err => console.error(err));
    }, []);

    const adicionarPalestra = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/palestras", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, descricao, data_palestra: data })
        }).then(() => {
            setTitulo("");
            setDescricao("");
            setData("");
            window.location.reload();
        });
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">Sistema de Palestras</h1>

            <form onSubmit={adicionarPalestra} className="mt-5 space-y-3">
                <input
                    type="text"
                    placeholder="Título"
                    className="border p-2 w-full"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Descrição"
                    className="border p-2 w-full"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    className="border p-2 w-full"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded">
                    Adicionar Palestra
                </button>
            </form>

            <h2 className="text-2xl mt-10">Lista de Palestras</h2>
            <ul className="mt-5">
                {palestras.map(p => (
                    <li key={p.id} className="p-3 border-b">
                        <strong>{p.titulo}</strong> - {p.descricao}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
