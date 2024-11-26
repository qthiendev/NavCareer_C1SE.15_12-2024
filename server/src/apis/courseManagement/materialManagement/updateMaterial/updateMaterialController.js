const { tryUpdateMaterial, tryChangeMaterialOrdinal } = require('./updateMaterialService');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const now = () => new Date().toLocaleString();

const updateMaterial = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { collection_id, material_id, material_content, material_type_id } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] | 'aid' is required.`);
            return res.status(400).json({ message: `'aid' is required.`, time: now() });
        }

        if (!role) {
            console.error(`[${now()}] | 'role' is required.`);
            return res.status(400).json({ message: `'role' is required.`, time: now() });
        }

        const result = await tryUpdateMaterial(aid, role, collection_id, material_id, material_content, material_type_id);

        if (result === 'BANNED') {
            console.error(`[${now()}] | User ${aid} is banned from updating materials.`);
            return res.status(403).json({ message: `User ${aid} is banned from updating materials.`, time: now() });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] | User ID ${aid} not found.`);
            return res.status(404).json({ message: `User ID ${aid} not found.`, time: now() });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] | Collection ${collection_id} does not exist.`);
            return res.status(404).json({ message: `Collection ${collection_id} does not exist.`, time: now() });
        }

        if (result === 'U_MID') {
            console.error(`[${now()}] | Material ${material_id} does not exist.`);
            return res.status(404).json({ message: `Material ${material_id} does not exist.`, time: now() });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] | Material updated successfully in Collection ${collection_id}.`);
            return res.status(200).json({ message: `Material updated successfully in Collection ${collection_id}.`, time: now() });
        }

        console.error(`[${now()}] | Failed to update material in Collection ${collection_id}.`);
        return res.status(500).json({ message: `Failed to update material in Collection ${collection_id}.`, time: now() });
    } catch (err) {
        console.error(`[${now()}] | ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error', time: now() });
    }
};

const changeMaterialOrdinal = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { collection_id, material_id_1, material_id_2 } = req.query;

        if (Number.isNaN(aid) || !aid) {
            console.error(`[${now()}] | 'aid' is required.`);
            return res.status(400).json({ message: `'aid' is required.`, time: now() });
        }

        if (!role) {
            console.error(`[${now()}] | 'role' is required.`);
            return res.status(400).json({ message: `'role' is required.`, time: now() });
        }

        const result = await tryChangeMaterialOrdinal(aid, role, collection_id, material_id_1, material_id_2);

        if (result === 'BANNED') {
            console.error(`[${now()}] | User ${aid} is banned from changing material ordinals.`);
            return res.status(403).json({ message: `User ${aid} is banned from changing material ordinals.`, time: now() });
        }

        if (result === 'U_UID') {
            console.error(`[${now()}] | User ID ${aid} not found.`);
            return res.status(404).json({ message: `User ID ${aid} not found.`, time: now() });
        }

        if (result === 'U_CID') {
            console.error(`[${now()}] | Collection ${collection_id} does not exist.`);
            return res.status(404).json({ message: `Collection ${collection_id} does not exist.`, time: now() });
        }

        if (result === 'U_ORD') {
            console.error(`[${now()}] | One or both materials do not exist in Collection ${collection_id}.`);
            return res.status(404).json({ message: `One or both materials do not exist in Collection ${collection_id}.`, time: now() });
        }

        if (result === 'SUCCESSED') {
            console.log(`[${now()}] | Material ordinals changed successfully in Collection ${collection_id}.`);
            return res.status(200).json({ message: `Material ordinals changed successfully in Collection ${collection_id}.`, time: now() });
        }

        console.error(`[${now()}] | Failed to change material ordinals in Collection ${collection_id}.`);
        return res.status(500).json({ message: `Failed to change material ordinals in Collection ${collection_id}.`, time: now() });
    } catch (err) {
        console.error(`[${now()}] | ${err.message}`);
        res.status(500).json({ message: 'Internal Server Error', time: now() });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { c, m, co } = req.query;

        if (!c || !m || !co) {
            return cb(new Error('Invalid query parameters: c, m, and co are required.'));
        }

        const basePath = path.join(__dirname, '..', '..', '..', '..', '..', 'localResources', `courses/_${c}/_${m}/_${co}`);
        fs.mkdirSync(basePath, { recursive: true }); // Ensure the directory exists
        cb(null, basePath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use original file name
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5GB limit
}).single('file'); // Handle a single file upload

// Upload Media Controller
const uploadMedia = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(`[${new Date().toLocaleString()}] | Upload error: ${err.message}`);
            return res.status(400).json({ message: err.message, time: new Date().toLocaleString() });
        }

        const { c, m, co } = req.query;
        const file = req.file;

        if (!file) {
            console.error(`[${new Date().toLocaleString()}] | No file uploaded.`);
            return res.status(400).json({ message: 'No file uploaded.', time: new Date().toLocaleString() });
        }

        const fileSavePath = file.path;

        console.log(`[${new Date().toLocaleString()}] | File uploaded successfully to: ${fileSavePath}`);
        res.status(200).json({
            message: 'File uploaded successfully.',
            filePath: fileSavePath,
            time: new Date().toLocaleString(),
        });
    });
};


module.exports = { updateMaterial, changeMaterialOrdinal, uploadMedia };
