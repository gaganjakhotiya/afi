var req: any = require
var requireContext = req.context('../lib', true, /\.tsx?$/)
requireContext.keys().map(requireContext)