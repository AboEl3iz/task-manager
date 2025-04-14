import { Task } from "src/tasks/task/entities/task.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column({default: false})
    completed: boolean;
    @ManyToOne(() => Task, task => task.todochecklist, { onDelete: 'CASCADE' })
    task: Task;
}
