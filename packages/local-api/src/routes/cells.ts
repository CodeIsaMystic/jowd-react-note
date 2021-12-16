import express from "express"
import { promises as fs } from "fs"
import path from "path"

interface Cell {
  id: string
  content: string
  type: "text" | "code"
}

interface IErrType {
  code: string
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router()
  router.use(express.json())

  const fullPath = path.join(dir, filename)

  router.get("/cells", async (req, res) => {
    try {
      // read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" })

      res.send(JSON.parse(result))
    } catch (error) {
      const haserrorCode = (x: any): x is IErrType => {
        return x.code
      }
      // if read throws an error
      if (haserrorCode(error) && error.code === "ENOENT") {
        //add code to create a file and add default cells
        await fs.writeFile(fullPath, "[]", "utf-8")
        res.send([])
      } else {
        throw error
      }
    }
  })
  router.post("/cells", async (req, res) => {
    // take a list of cells from  the request object
    // serialize them
    const { cells }: { cells: Cell[] } = req.body

    // write the cells into a file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8")

    res.send({ status: "ok" })
  })

  return router
}
