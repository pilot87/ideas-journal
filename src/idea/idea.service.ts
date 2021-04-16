import { Injectable } from '@nestjs/common'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { Ideas } from './entities/idea.entity'
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class IdeaService {
  async create(createIdeaDto: CreateIdeaDto, author: string) {
    createIdeaDto.tags = createIdeaDto.tags.filter(
      (v, i, a) => a.indexOf(v) === i,
    )
    await Ideas.add(createIdeaDto, author)
    return { message: 'Idea created' }
  }

  async listall() {
    const ilist = await Ideas.listall()
    const result = [...new Set(ilist.map((idea) => idea.i))].map((iname) => {
      const first = ilist.find((el) => el.i === iname)
      const tags = ilist.filter((el) => el.i === iname).map((el) => el.tagname)
      tags.sort()
      return {
        idea: first.i,
        author: first.author,
        short_desc: first.short_desc,
        tags: tags,
      }
    })
    return { message: 'List', list: result }
  }

  async listbyuser(name: string) {
    const ilist = await Ideas.listbyuser(name)
    const result = [...new Set(ilist.map((idea) => idea.i))].map((iname) => {
      const first = ilist.find((el) => el.i === iname)
      const tags = ilist.filter((el) => el.i === iname).map((el) => el.tagname)
      tags.sort()
      return {
        idea: first.i,
        author: first.author,
        short_desc: first.short_desc,
        tags: tags,
      }
    })
    return { message: 'List', list: result }
  }

  async getByName(idea: string) {
    const ilist = await Ideas.getByName(idea)
    if (ilist.length === 0) {
      return { message: 'No ideas found' }
    }
    const result = ilist[0]
    result.tags = ilist.map((el) => el.tagname)
    delete result.tagname
    const tlist = await Ideas.getIdeaComments(idea)
    result.comments = tlist.map((el) => ({
      text: el.commenttext,
      author: el.username,
    }))
    return { message: 'Idea', idea: result }
  }

  async newComment(createCommentDto: CreateCommentDto, author: string) {
    await Ideas.newComment(createCommentDto, author)
  }
}
