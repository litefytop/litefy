module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.dependencies?.['style-to-js']) {
        pkg.dependencies['style-to-js'] = '2.0.0';
      }
      return pkg;
    }
  }
};
