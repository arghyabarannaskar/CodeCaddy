exports.homepage = async (req, res) => {
  const locals = {
    title: "CodeCaddy",
    description: " CodeCaddy App",
  };
  res.render("index", { locals, layout: "layouts/front-page" });
};

exports.about = async (req, res) => {
  const locals = {
    title: "About - CodeCaddy App",
    description: " CodeCaddy App",
  };
  res.render("about", locals);
};

//async is used for future proofing ...it doesn't affect anything
