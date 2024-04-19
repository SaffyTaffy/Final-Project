package com.example.tictactoeserver;

import jakarta.ws.rs.*;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
@Path("/api")
public class TicTacToeResource {

    private static String currentPlayer = "X"; // Initialize with player X

    private static String[][] board = new String[3][3]; // Game board

    // Initialize the board
    static {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    }

    @POST
    @Path("/start")
    @Produces(MediaType.APPLICATION_JSON)
    public Response startGame() {
        // Start a new game
        currentPlayer = "X";
        clearBoard();
        return Response.ok().entity(board).build();
    }

    @POST
    @Path("/move/{row}/{col}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response makeMove(@PathParam("row") int row, @PathParam("col") int col) {
        // Make a move
        if (board[row][col].isEmpty()) {
            board[row][col] = currentPlayer;
            // Check for winner
            if (checkWinner(currentPlayer)) {
                return Response.ok().entity("Winner: " + currentPlayer).build();
            }
            // Switch player
            currentPlayer = (currentPlayer.equals("X")) ? "O" : "X";
            return Response.ok().entity(board).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST).entity("Cell already occupied").build();
        }
    }

    @POST
    @Path("/restart")
    @Produces(MediaType.APPLICATION_JSON)
    public Response restartGame() {
        // Restart the game
        currentPlayer = "X";
        clearBoard();
        return Response.ok().entity(board).build();
    }

    private void clearBoard() {
        // Clear the board
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    }

    private boolean checkWinner(String player) {
        // Check for winning conditions
        for (int i = 0; i < 3; i++) {
            if (board[i][0].equals(player) && board[i][1].equals(player) && board[i][2].equals(player)) {
                return true; // Horizontal win
            }
            if (board[0][i].equals(player) && board[1][i].equals(player) && board[2][i].equals(player)) {
                return true; // Vertical win
            }
        }
        if (board[0][0].equals(player) && board[1][1].equals(player) && board[2][2].equals(player)) {
            return true; // Diagonal win (top-left to bottom-right)
        }
        if (board[0][2].equals(player) && board[1][1].equals(player) && board[2][0].equals(player)) {
            return true; // Diagonal win (top-right to bottom-left)
        }
        return false;
    }
}


