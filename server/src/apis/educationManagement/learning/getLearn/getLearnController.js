const fs = require('fs');
const path = require('path');
const { tryGetCollection, tryGetFrame } = require('./getLearnService');
const now = new Date();

const getCollection = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { c, m, co } = req.query;

        // Validate parameters
        if (c == null || isNaN(c) || m == null || isNaN(m) || co == null || isNaN(co)) {
            return res.status(400).json({
                message: 'Invalid parameters: c, m, and co must be valid numbers.',
                time: new Date().toLocaleString()
            });
        }

        const collections = await tryGetCollection(aid, role, Number.parseInt(c), Number.parseInt(m), Number.parseInt(co));

        if (collections) {
            const groupedCollections = collections.reduce((acc, item) => {
                const key = `${item.collection_type_name}-${item.collection_id}`;

                // Initialize collection if not already present
                if (!acc[key]) {
                    acc[key] = {
                        collection_type_name: item.collection_type_name,
                        collection_id: item.collection_id,
                        collection_name: item.collection_name,
                        materials: [] // Initialize as empty array
                    };
                }

                if (item.material_type_name === 'Question') {
                    // Check if the question already exists in the materials array
                    let question = acc[key].materials.find(q =>
                        q.material_ordinal === item.material_ordinal &&
                        q.material_content === item.material_content &&
                        q.question_ordinal === item.question_ordinal
                    );

                    // If the question doesn't exist, create it
                    if (!question) {
                        question = {
                            material_type_name: item.material_type_name,
                            material_ordinal: item.material_ordinal,
                            material_content: item.material_content,
                            question_type_name: item.question_type_name,
                            question_ordinal: item.question_ordinal,
                            question_description: item.question_description,
                            answers: [] // Initialize answers as empty array
                        };

                        acc[key].materials.push(question); // Add the question to the materials
                    }

                    // Push the answer details into the answers array
                    question.answers.push({
                        answer_ordinal: item.answer_ordinal,
                        answer_description: item.answer_description,
                        answer_is_right: item.answer_is_right
                    });
                } else {
                    // Handle non-question materials
                    const material = {
                        material_type_name: item.material_type_name,
                        material_ordinal: item.material_ordinal,
                        material_content: item.material_content,
                    };

                    // Add non-question materials directly to the collection
                    acc[key].materials.push(material);
                }

                return acc;
            }, {});

            // Convert grouped collections object to an array
            const collectionsArray = Object.values(groupedCollections);

            // Ensure each collection has an empty materials array if no materials were found
            collectionsArray.forEach(collection => {
                if (!collection.materials) {
                    collection.materials = [];
                }
            });

            return res.status(200).json({
                collections: collectionsArray,
                time: new Date().toLocaleString()
            });
        } else {
            // If no collections are found, return an empty array for collections
            return res.status(203).json({
                collections: [], // Return an empty array
                message: `Collection of course(${c}) -> module(${m}) -> collection(${co}) not found.`,
                time: new Date().toLocaleString()
            });
        }
    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at getLearnController.js/getCollection | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
};

const getFrame = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { c } = req.query;

        if (c == null || isNaN(c)) {
            return res.status(400).json({
                message: 'Invalid parameters: c must be a valid number.',
                time: new Date().toLocaleString()
            });
        }

        const frames = await tryGetFrame(aid, role, Number.parseInt(c));

        if (frames) {
            // Transform frames into nested structure
            const nestedFrames = {};

            frames.forEach(frame => {
                const { module_id, module_ordinal, module_name, collection_type_name, collection_id, collection_ordinal, collection_name } = frame;

                // Create a module entry if it doesn't exist
                if (!nestedFrames[module_id]) {
                    nestedFrames[module_id] = {
                        module_id,
                        module_ordinal,
                        module_name,
                        collections: [] // Initialize collections array
                    };
                }

                // Only add collections if they have valid properties
                if (collection_type_name || collection_id !== null || collection_name) {
                    nestedFrames[module_id].collections.push({
                        collection_type_name: collection_type_name !== undefined ? collection_type_name : null,
                        collection_id: collection_id !== undefined ? collection_id : null,
                        collection_ordinal: collection_ordinal !== undefined ? collection_ordinal : null,
                        collection_name: collection_name !== undefined ? collection_name : null
                    });
                }
            });

            // Convert nestedFrames to an array
            const modules = Object.values(nestedFrames).map(module => ({
                ...module,
                collections: module.collections.length > 0 ? module.collections : [] // Ensure collections is empty if no records
            }));

            return res.status(200).json({
                modules,
                time: new Date().toLocaleString()
            });
        } else {
            return res.status(400).json({
                message: 'Cannot read frame',
                time: new Date().toLocaleString()
            });
        }

    } catch (err) {
        console.error(`[${new Date().toLocaleString()}] at getLearnController.js/getFrame | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
};



// Serve image or video as binary data
const serveMedia = (req, res) => {
    const { c, m, co, filePath } = req.query;

    const safeBasePath = path.join(__dirname, '..', '..', '..', '..', '..', 'localResources', `courses/_${c}/_${m}/_${co}`);
    console.warn(safeBasePath)
    const resolvedPath = path.resolve(safeBasePath, filePath);
    console.warn(resolvedPath)

    if (!resolvedPath.startsWith(safeBasePath)) {
        return res.status(403).send('Access denied');
    }

    fs.readFile(resolvedPath, (err, data) => {
        if (err) {
            return res.status(203).send('File not found');
        }

        const ext = path.extname(resolvedPath).toLowerCase();
        let contentType = 'application/octet-stream';

        switch (ext) {
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.mp4':
                contentType = 'video/mp4';
                break;
        }

        res.setHeader('Content-Type', contentType);
        res.send(data);
    });
};

module.exports = { getCollection, serveMedia, getFrame };
