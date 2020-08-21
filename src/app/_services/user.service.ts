import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any[]>(`${config.apiUrl}/users`);
    }

    register(user) {
        return this.http.post(`http://localhost:3000`, {
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "phoneNo": user.phoneNo,
                "username": user.username,
                "password": user.password,
        });
    }

    delete(id) {
        return this.http.delete(`${config.apiUrl}/users/${id}`);
    }
}