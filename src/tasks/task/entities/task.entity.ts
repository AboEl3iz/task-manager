import { Auth } from "src/auth/auth/entities/register";
import { Todo } from "src/tasks/todo/entities/todo.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    description: string;
    @Column({type: 'enum', enum: ['pending', 'inprogress', 'completed'], default: 'pending'})
    status: string;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    @Column({type: 'enum', enum: ['low', 'medium', 'high'], default: 'low'})
    priority: string;
    @Column({type: 'timestamp'})
    dueDate: Date;
    @Column({type: 'float', default: 0})
    progress: number;
    @ManyToOne(() => Auth, (user) => user.createdTasks)
    @JoinColumn({ name: 'createdById' }) 
    createdBy: Auth;

    @ManyToMany(() => Auth, user => user.assignedTasks, { cascade: true })
    @JoinTable()  // This creates the join table (e.g. task_assigned_users)
    assignedTo: Auth[];
    
    @Column({type: 'varchar', array: true})
    attachments: string[];
    @OneToMany(() => Todo, todo => todo.task, { cascade: true })
    todochecklist: Todo[];
}
