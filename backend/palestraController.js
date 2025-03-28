const db = require("./database");

// Criar uma nova palestra
exports.createPalestra = (req, res) => {
    const { titulo, descricao, data_palestra } = req.body;
    const sql = "INSERT INTO palestras (titulo, descricao, data_palestra) VALUES (?, ?, ?)";
    db.query(sql, [titulo, descricao, data_palestra], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Palestra criada com sucesso!" });
    });
};

// Listar todas as palestras
exports.getPalestras = (req, res) => {
    db.query("SELECT * FROM palestras", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Deletar palestra por ID
exports.deletePalestra = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM palestras WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Palestra deletada com sucesso!" });
    });
};
