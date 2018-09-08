const express = require("express");
const { upload } = require("./Multer");
const { Singer } = require("./Singer");
const app = express();

app.locals.isDev = !process.env.PORT;
if (!process.env.PORT) {
    require("reload")(app);

}

app.set('view engine', 'ejs');


//middleware function
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('singer', { singers: [] });
});

app.get('/singer', (req, res) => {
    Singer.find({})
        .then(singers => res.render('singer', { singers }));
});

app.get('/singer/add', (req, res) => {
    res.render('add');
});

//up 1 hình
app.post('/singer/add', (req, res) => {

    upload.single("image")(req, res, error => {

        if (error)
            return res.send(error.message);

        const { name, link } = req.body;
        const image = req.file.filename;
        const singer = new Singer({ name, link, image });
        singer.save()
            .then(() => res.redirect("/singer"))
            .catch(error => res.send(error.message));
    });

});

//up nhiều hình cùng field
// app.post('/singer/add', (req, res) => {

//     upload.array("image")(req, res, error => {

//         if (error)
//             return res.send(error.message);

//         const { name, link } = req.body;
//         const image = req.files.filename;
//         const singer = new Singer({ name, link, image });
//         singer.save()
//             .then(() => res.redirect("/singer"))
//             .catch(error => res.send(error.message));
//     });

// });

//up nhiều hình khác field
// app.post('/singer/add', (req, res) => {

//     const fieldsConfig = [
//         { name: "image", maxCount: 1 },
//         { name: "gallery" }
//     ];
//     upload.fields(fieldsConfig)(req, res, error => {

//         if (error)
//             return res.send(error.message);

//         const { name, link } = req.body;
//         const image = req.files.filename;
//         const singer = new Singer({ name, link, image });
//         singer.save()
//             .then(() => res.redirect("/singer"))
//             .catch(error => res.send(error.message));
//     });

// });

app.get('/singer/update/:id', (req, res) => {
    const { id } = req.params;

    // Singer.find({ _id: id }) 
    // trả về mảng cho nên ko thể dùng ở trường hợp này

    Singer.findById(id)
        .then(sger => {
            if (!sger) throw new Error("Cannot find singer");
            res.render('update', { sger });
        })
        .catch(error => res.send(error.message));

});

app.post('/singer/update/:id', (req, res) => {

    upload.single("image")(req, res, error => {
        if (error)
            return res.send(error.message);

        const { name, link } = req.body;
        if (req.file) {

            const image = req.file.filename;
            Singer.findByIdAndUpdate(req.params.id, { name, link, image })
                .then(singer => {
                    if (!singer) throw new Error("Cannot find singer!");
                    res.redirect("/singer");
                })
                .catch(error => res.send(error));
        } else {

            Singer.findByIdAndUpdate(req.params.id, { name, link })
                .then(singer => {
                    if (!singer) throw new Error("Cannot find singer!");

                    res.redirect("/singer");
                })
                .catch(error => res.send(error));
        }
    });


});

app.get('/singer/remove/:id', (req, res) => {
    const { id } = req.params;
    Singer.findByIdAndRemove(id)
        .then(singer => {
            if (!singer) throw new Error("Cannot find singer!");
            res.redirect("/singer");
        })
        .catch(error => res.send(error.message));
});


app.listen(process.env.PORT || 3000, () => console.log("Server started !!!"));