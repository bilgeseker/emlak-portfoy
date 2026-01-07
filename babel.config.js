// module.exports = {
//   presets: [
//     '@vue/cli-plugin-babel/preset'
//   ]
// }

module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      targets: { esmodules: true }  //navigasyonda hata geliyordu bu şekilde gelmiyor
    }]
  ]
}