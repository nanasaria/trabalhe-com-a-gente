import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { Paginate } from '../../model/Paginate.model';

@Component({
    selector: 'app-paginate',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paginate.component.html',
    styleUrl: './paginate.component.css',
})
export class PaginateComponent implements OnChanges {
    @Input() paginate: Paginate[] = [];
    currentPage: string = '';

    @Output() eventPage = new EventEmitter<string>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['paginate'] && this.paginate.length > 0) {
            this.calcCurrentPage();
        }
    }

    onChangePage(url: string) {
        this.eventPage.emit(url);
    }

    calcCurrentPage(): string {
        if (!this.paginate[0]) return '';

        const next = Number(this.paginate[0].next_number);
        const prev = Number(this.paginate[0].prev_number);

        if (isNaN(next)) {
            return (this.currentPage = String(prev + 1));
        }

        return (this.currentPage = String(next - 1));
    }
}
