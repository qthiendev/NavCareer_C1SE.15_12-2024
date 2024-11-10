const fs = require('fs');
const path = require('path');
const { tryGetCollection, tryGetFrame } = require('./getLearnService');
const now = new Date();

const getCollection = async (req, res) => {
    try {
        const { aid, role } = req.session;
        const { c, m, co } = req.query;

        if (c == null || isNaN(c)
            || m == null || isNaN(m)
            || co == null || isNaN(co)) {
            return res.status(400).json({
                message: 'Invalid parameters: c, m, and co must be valid numbers.',
                time: new Date().toLocaleString()
            });
        }

        const collections = await tryGetCollection(aid, role, Number.parseInt(c), Number.parseInt(m), Number.parseInt(co));

        if (collections) {
            const groupedCollections = collections.reduce((acc, item) => {
                const key = `${item.collection_type_name}-${item.collection_id}`;
                if (!acc[key]) {
                    acc[key] = {
                        collection_type_name: item.collection_type_name,
                        collection_id: item.collection_id,
                        collection_name: item.collection_name,
                        materials: []
                    };
                }

                if (item.material_type_name === 'Question') {
                    let question = acc[key].materials.find(q =>
                        q.material_ordinal === item.material_ordinal &&
                        q.material_content === item.material_content &&
                        q.question_ordinal === item.question_ordinal
                    );

                    if (!question) {
                        question = {
                            material_type_name: item.material_type_name,
                            material_ordinal: item.material_ordinal,
                            material_content: item.material_content,
                            question_type_name: item.question_type_name,
                            question_ordinal: item.question_ordinal,
                            question_description: item.question_description,
                            answers: []
                        };
                        acc[key].materials.push(question);
                    }

                    question.answers.push({
                        answer_ordinal: item.answer_ordinal,
                        answer_description: item.answer_description,
                        answer_is_right: item.answer_is_right
                    });
                } else {
                    const material = {
                        material_type_name: item.material_type_name,
                        material_ordinal: item.material_ordinal,
                        material_content: item.material_content
                    };
                    acc[key].materials.push(material);
                }

                return acc;
            }, {});

            const collectionsArray = Object.values(groupedCollections);
            collectionsArray.forEach(collection => {
                if (!collection.materials) collection.materials = [];
            });

            return res.status(200).json({
                module_id: collections[0].module_id,
                collection_id: collections[0].collection_id,
                collections: collectionsArray,
                time: new Date().toLocaleString()
            });
        } else {
            return res.status(203).json({
                collections: [],
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
            return res.status(400).json({ message: 'Invalid parameters: c must be a valid number.', time: new Date().toLocaleString() });
        }

        const frames = await tryGetFrame(aid, role, Number.parseInt(c));

        if (frames) {
            const nestedFrames = {};
            frames.forEach(frame => {
                const {
                    module_id,
                    module_ordinal,
                    module_name,
                    collection_type_name,
                    collection_id,
                    collection_ordinal,
                    collection_name
                } = frame;

                if (!nestedFrames[module_id]) {
                    nestedFrames[module_id] = { module_id, module_ordinal, module_name, collections: [] };
                }

                if (collection_type_name || collection_id !== null || collection_name) {
                    nestedFrames[module_id].collections.push({
                        collection_type_name: collection_type_name !== undefined ? collection_type_name : null,
                        collection_id: collection_id !== undefined ? collection_id : null,
                        collection_ordinal: collection_ordinal !== undefined ? collection_ordinal : null,
                        collection_name: collection_name !== undefined ? collection_name : null
                    });
                }
            });

            const modules = Object.values(nestedFrames).map(module => ({
                ...module, collections: module.collections.length > 0 ? module.collections : []
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

const serveMedia = (req, res) => {
    try {
        const { c, m, co, filePath } = req.query;
        const safeBasePath = path.join(__dirname, '..', '..', '..', '..', '..', 'localResources', `courses/_${c}/_${m}/_${co}`);
        const resolvedPath = path.resolve(safeBasePath, filePath);

        if (!resolvedPath.startsWith(safeBasePath)) {
            console.error(`[${now.toLocaleString()}] at getLearnController.js/serveMedia | Media denied access at: ${resolvedPath}`);
            return res.status(403).send('Access denied');
        }

        fs.readFile(resolvedPath, (err, data) => {
            if (err) {
                console.warn(`[${now.toLocaleString()}] at getLearnController.js/serveMedia | Media not found at: ${resolvedPath}`);
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
            console.log('\x1b[32m%s\x1b[0m', `[${now.toLocaleString()}] at getLearnController.js/serveMedia | Media found at: ${resolvedPath}`);
            res.setHeader('Content-Type', contentType);
            res.send(data);
        });
    } catch (err) {
        console.error(`[${now.toLocaleString()}] at getLearnController.js/serveMedia | ${err.message}`);
        res.status(500).json({
            message: 'Internal Server Error',
            time: new Date().toLocaleString()
        });
    }
};

module.exports = { getCollection, serveMedia, getFrame };
