import { Task } from "src/tasks/task/entities/task.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn,  } from "typeorm";

@Entity()
export class Auth {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({unique: true})
    email: string;
    @Column()
    password: string;
    @Column({type: 'enum', enum: ['admin', 'member'], default: 'member'})
    role: string;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    @OneToMany(() => Task, task => task.createdBy)
     createdTasks: Task[];
     @ManyToMany(() => Task, task => task.assignedTo)
     assignedTasks: Task[];
}
