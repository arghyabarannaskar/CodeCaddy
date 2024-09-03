exports.homepage = async (req, res) => {
  const locals = {
    title: "NodeJs Notes",
    description: " Free NodeJs Notes App",
  };
  res.render("index", { locals, layout: "layouts/front-page" });
};

exports.about = async (req, res) => {
  const locals = {
    title: "About - NodeJs Notes",
    description: " Free NodeJs Notes App",
  };
  res.render("about", locals);
};

//async is used for future proofing ...it doesn't affect anything
