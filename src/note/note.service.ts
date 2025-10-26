import {
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class NoteService {
    private logger = new Logger(NoteService.name);
    constructor(private readonly prismaService: PrismaService) {}

    async create(createNoteDto: CreateNoteDto, userId: number) {
        const note = await this.prismaService.note.create({
            data: {
                title: createNoteDto.title,
                body: createNoteDto.body,
                userId,
            },
        });
        this.logger.log(`Created note with id: ${note.id}`);

        return note;
    }

    async findAll(
        { take, skip }: { take: number; skip: number },
        userId: number,
    ) {
        const notes = await this.prismaService.note.findMany({
            take,
            skip,
            where: {
                userId,
            },
        });

        return notes;
    }

    async findOne(id: number, userId: number) {
        const note = await this.prismaService.note.findFirst({
            where: {
                id,
            },
        });
        if (!note) {
            throw new NotFoundException("Note not found");
        }

        if (note.userId !== userId) {
            throw new ForbiddenException("Access to resource denied");
        }

        return note;
    }

    async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
        const note = await this.prismaService.note.findFirst({
            where: {
                id,
            },
        });

        if (!note) {
            throw new NotFoundException("Note not found");
        }
        if (note.userId !== userId) {
            throw new ForbiddenException("Access to resource denied");
        }

        const updatedNote = await this.prismaService.note.update({
            where: {
                id,
            },
            data: {
                title: updateNoteDto.title,
                body: updateNoteDto.body,
            },
        });

        return updatedNote;
    }

    async remove(id: number, userId: number) {
        try {
            const note = await this.prismaService.note.delete({
                where: { id, userId },
            });
            return note;
        } catch {
            throw new NotFoundException("Note not found or access denied");
        }
    }
}
