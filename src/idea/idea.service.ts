import { Injectable } from '@nestjs/common'
import { CreateIdeaDto } from './dto/create-idea.dto'
import { Ideas } from './entities/idea.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { NegativeException } from '../negative.filter';

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
    const ideas = await Ideas.list()
    const tags = await Ideas.listt()
    return {
      message: 'List',
      list: ideas.map((i) => ({
        ...i,
        tags: tags
          .filter((t) => t.ideaname === i.ideaname)
          .map((t) => t.tagname),
      })),
    }
  }

  // complex code here for not implement complex SQL for rare quarry
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
        status: first.status,
        tags: tags,
      }
    })
    return { message: 'List', list: result }
  }

  async getByName(idea: string) {
    const ilist = await Ideas.getByName(idea)
    if (ilist.length === 0) {
      throw new NegativeException({ message: 'No ideas found' })
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
